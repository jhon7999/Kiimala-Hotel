import { boolean, date, integer, pgTable, serial, text, timestamp, uniqueIndex, index } from "drizzle-orm/pg-core";

export const ROLES = ["admin", "recepcion", "ventas", "limpieza"] as const;
export type Rol = (typeof ROLES)[number];

export const usuarios = pgTable("usuarios", {
  id: serial("id").primaryKey(),
  nombre: text("nombre").notNull(),
  usuario: text("usuario").notNull().unique(),
  claveHash: text("clave_hash").notNull(),
  rol: text("rol").$type<Rol>().notNull(),
  activo: boolean("activo").notNull().default(true),
  fallos: integer("fallos").notNull().default(0),
  bloqueadoHasta: timestamp("bloqueado_hasta", { withTimezone: true }),
  creado: timestamp("creado", { withTimezone: true }).notNull().defaultNow(),
});

export const habitaciones = pgTable("habitaciones", {
  id: serial("id").primaryKey(),
  torre: text("torre").notNull(),
  numero: text("numero").notNull(),
  nombre: text("nombre").notNull().unique(), // "Cisnes 101"
  capacidad: integer("capacidad").notNull(),
  camas: text("camas").notNull().default(""),
  vip: boolean("vip").notNull().default(false),
  activa: boolean("activa").notNull().default(true),
  orden: integer("orden").notNull().default(0),
  // limpia | sucia | en_limpieza
  limpieza: text("limpieza").notNull().default("limpia"),
  notas: text("notas").notNull().default(""),
});

export type EstadoReserva = "confirmada" | "en_casa" | "finalizada" | "cancelada";

export const reservas = pgTable(
  "reservas",
  {
    id: serial("id").primaryKey(),
    codigo: text("codigo").notNull().unique(),
    habitacionId: integer("habitacion_id").notNull().references(() => habitaciones.id),
    entrada: date("entrada", { mode: "string" }).notNull(),
    salida: date("salida", { mode: "string" }).notNull(), // la noche de salida queda libre
    estado: text("estado").$type<EstadoReserva>().notNull().default("confirmada"),
    huesped: text("huesped").notNull(),
    telefono: text("telefono").notNull().default(""),
    personas: integer("personas").notNull().default(1),
    canal: text("canal").notNull().default("whatsapp"), // whatsapp | directo | agencia | otro
    total: integer("total").notNull().default(0),
    abonado: integer("abonado").notNull().default(0),
    notas: text("notas").notNull().default(""),
    grupo: text("grupo"), // une varias habitaciones de una misma reserva
    creadoPor: text("creado_por").notNull().default(""),
    creado: timestamp("creado", { withTimezone: true }).notNull().defaultNow(),
    checkInAt: timestamp("check_in_at", { withTimezone: true }),
    checkOutAt: timestamp("check_out_at", { withTimezone: true }),
  },
  (t) => [index("reservas_hab_fechas").on(t.habitacionId, t.entrada, t.salida)],
);

export const bloqueos = pgTable("bloqueos", {
  id: serial("id").primaryKey(),
  habitacionId: integer("habitacion_id").notNull().references(() => habitaciones.id),
  desde: date("desde", { mode: "string" }).notNull(),
  hasta: date("hasta", { mode: "string" }).notNull(),
  motivo: text("motivo").notNull().default("Mantenimiento"),
  creado: timestamp("creado", { withTimezone: true }).notNull().defaultNow(),
});

export type EstadoTarea = "pendiente" | "en_proceso" | "lista";

export const tareasLimpieza = pgTable("tareas_limpieza", {
  id: serial("id").primaryKey(),
  habitacionId: integer("habitacion_id").notNull().references(() => habitaciones.id),
  estado: text("estado").$type<EstadoTarea>().notNull().default("pendiente"),
  motivo: text("motivo").notNull().default("Salida de huésped"),
  pedidoPor: text("pedido_por").notNull().default("sistema"),
  tomadaPor: text("tomada_por"),
  creada: timestamp("creada", { withTimezone: true }).notNull().defaultNow(),
  iniciada: timestamp("iniciada", { withTimezone: true }),
  terminada: timestamp("terminada", { withTimezone: true }),
});

// Tokens para integraciones (p. ej. Destidnos). Solo se guarda el hash.
export const tokensApi = pgTable(
  "tokens_api",
  {
    id: serial("id").primaryKey(),
    nombre: text("nombre").notNull(),
    tokenHash: text("token_hash").notNull(),
    activo: boolean("activo").notNull().default(true),
    ultimoUso: timestamp("ultimo_uso", { withTimezone: true }),
    creado: timestamp("creado", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex("tokens_hash").on(t.tokenHash)],
);

export const historial = pgTable("historial", {
  id: serial("id").primaryKey(),
  usuario: text("usuario").notNull(),
  accion: text("accion").notNull(),
  detalle: text("detalle").notNull().default(""),
  fecha: timestamp("fecha", { withTimezone: true }).notNull().defaultNow(),
});
