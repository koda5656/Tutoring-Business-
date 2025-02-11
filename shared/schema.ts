import { pgTable, text, serial, integer, boolean, decimal, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull(),
  isAdmin: boolean("is_admin").default(false),
});

export const packages = pgTable("packages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  hours: integer("hours").notNull(),
  pricePerHour: decimal("price_per_hour").notNull(),
  maxStudents: integer("max_students").notNull(),
});

export const subjects = pgTable("subjects", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  level: text("level").notNull(), // e.g., "Beginner", "Intermediate", "Advanced"
});

export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  packageId: integer("package_id").references(() => packages.id),
  subjectId: integer("subject_id").references(() => subjects.id),
  startDate: timestamp("start_date").notNull(),
  status: text("status").notNull().default("pending"), // pending, confirmed, completed, cancelled
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  isAdmin: true,
}).extend({
  password: z.string().min(6, "Password must be at least 6 characters"),
  email: z.string().email("Invalid email address"),
});

export const insertPackageSchema = createInsertSchema(packages).omit({
  id: true,
});

export const insertSubjectSchema = createInsertSchema(subjects).omit({
  id: true,
});

export const insertBookingSchema = createInsertSchema(bookings).omit({
  id: true,
  status: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Package = typeof packages.$inferSelect;
export type Subject = typeof subjects.$inferSelect;
export type Booking = typeof bookings.$inferSelect;
export type InsertPackage = z.infer<typeof insertPackageSchema>;
export type InsertSubject = z.infer<typeof insertSubjectSchema>;
export type InsertBooking = z.infer<typeof insertBookingSchema>;