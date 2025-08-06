import { pgTable, text, serial, integer, boolean, timestamp, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const vehicles = pgTable("vehicles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  registration: text("registration").notNull().unique(),
  make: text("make").notNull(),
  model: text("model").notNull(),
  year: integer("year").notNull(),
  color: text("color").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const drivers = pgTable("drivers", {
  id: serial("id").primaryKey(),
  vehicleId: integer("vehicle_id").references(() => vehicles.id).notNull(),
  name: text("name").notNull(),
  relationship: text("relationship").notNull(),
  isActive: boolean("is_active").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const parkingSessions = pgTable("parking_sessions", {
  id: serial("id").primaryKey(),
  vehicleId: integer("vehicle_id").references(() => vehicles.id).notNull(),
  driverId: integer("driver_id").references(() => drivers.id).notNull(),
  location: text("location").notNull(),
  carParkNumber: text("car_park_number").notNull(),
  startTime: timestamp("start_time").defaultNow().notNull(),
  endTime: timestamp("end_time"),
  hourlyRate: decimal("hourly_rate", { precision: 10, scale: 2 }).notNull(),
  totalCost: decimal("total_cost", { precision: 10, scale: 2 }),
  status: text("status").notNull().default("active"), // active, completed, expired
  paymentStatus: text("payment_status").notNull().default("unpaid"), // paid, unpaid, processing
});

export const carPark = pgTable("car_parks", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  location: text("location").notNull(),
  latitude: decimal("latitude", { precision: 10, scale: 8 }).notNull(),
  longitude: decimal("longitude", { precision: 11, scale: 8 }).notNull(),
  totalSpaces: integer("total_spaces").notNull(),
  availableSpaces: integer("available_spaces").notNull(),
  hourlyRate: decimal("hourly_rate", { precision: 10, scale: 2 }).notNull(),
  status: text("status").notNull().default("available"), // available, limited, full
});

export const serviceRecords = pgTable("service_records", {
  id: serial("id").primaryKey(),
  vehicleId: integer("vehicle_id").references(() => vehicles.id).notNull(),
  serviceType: text("service_type").notNull(),
  provider: text("provider").notNull(),
  serviceDate: timestamp("service_date").notNull(),
  cost: decimal("cost", { precision: 10, scale: 2 }).notNull(),
  notes: text("notes"),
  nextServiceDue: timestamp("next_service_due"),
  status: text("status").notNull().default("completed"), // completed, scheduled, cancelled
});

export const fines = pgTable("fines", {
  id: serial("id").primaryKey(),
  vehicleId: integer("vehicle_id").references(() => vehicles.id).notNull(),
  fineType: text("fine_type").notNull(),
  location: text("location").notNull(),
  issueDate: timestamp("issue_date").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  dueDate: timestamp("due_date").notNull(),
  description: text("description").notNull(),
  status: text("status").notNull().default("pending"), // paid, pending, overdue, appealed
  evidenceUrl: text("evidence_url"),
  paymentDate: timestamp("payment_date"),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertVehicleSchema = createInsertSchema(vehicles).omit({
  id: true,
  createdAt: true,
});

export const insertDriverSchema = createInsertSchema(drivers).omit({
  id: true,
  createdAt: true,
});

export const insertParkingSessionSchema = createInsertSchema(parkingSessions).omit({
  id: true,
  startTime: true,
});

export const insertCarParkSchema = createInsertSchema(carPark).omit({
  id: true,
});

export const insertServiceRecordSchema = createInsertSchema(serviceRecords).omit({
  id: true,
});

export const insertFineSchema = createInsertSchema(fines).omit({
  id: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertVehicle = z.infer<typeof insertVehicleSchema>;
export type Vehicle = typeof vehicles.$inferSelect;

export type InsertDriver = z.infer<typeof insertDriverSchema>;
export type Driver = typeof drivers.$inferSelect;

export type InsertParkingSession = z.infer<typeof insertParkingSessionSchema>;
export type ParkingSession = typeof parkingSessions.$inferSelect;

export type InsertCarPark = z.infer<typeof insertCarParkSchema>;
export type CarPark = typeof carPark.$inferSelect;

export type InsertServiceRecord = z.infer<typeof insertServiceRecordSchema>;
export type ServiceRecord = typeof serviceRecords.$inferSelect;

export type InsertFine = z.infer<typeof insertFineSchema>;
export type Fine = typeof fines.$inferSelect;
