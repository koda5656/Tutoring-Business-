import { pgTable, text, serial, integer, boolean, decimal, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull(),
  fullName: text("full_name").notNull(),
  isAdmin: boolean("is_admin").default(false),
  phoneNumber: text("phone_number"),
  gradeLevel: text("grade_level"),
});

export const packages = pgTable("packages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  totalHours: integer("total_hours").notNull(),
  pricePerHour: decimal("price_per_hour", { precision: 10, scale: 2 }).notNull(),
  maxStudents: integer("max_students").notNull(),
  validityPeriod: integer("validity_period").notNull(), // in days
  featuredOrder: integer("featured_order"), // for featured packages display order, null if not featured
});

export const subjects = pgTable("subjects", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  level: text("level").notNull(), // e.g., "Elementary", "Middle School", "High School", "College"
  category: text("category").notNull(), // e.g., "Mathematics", "Science", "Languages"
  imageUrl: text("image_url"), // URL to subject icon or illustration
});

export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  packageId: integer("package_id").references(() => packages.id),
  subjectId: integer("subject_id").references(() => subjects.id),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  status: text("status").notNull().default("pending"), // pending, confirmed, completed, cancelled
  notes: text("notes"), // Special requirements or notes for the session
  zoomLink: text("zoom_link"), // Online session link
  remainingHours: decimal("remaining_hours", { precision: 10, scale: 2 }), // Tracks remaining hours in the package
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  isAdmin: true,
}).extend({
  password: z.string().min(6, "Password must be at least 6 characters"),
  email: z.string().email("Invalid email address"),
  fullName: z.string().min(2, "Full name is required"),
  phoneNumber: z.string().optional(),
  gradeLevel: z.string().optional(),
});

export const insertPackageSchema = createInsertSchema(packages).omit({
  id: true,
  featuredOrder: true,
}).extend({
  totalHours: z.number().min(1, "Package must include at least 1 hour"),
  pricePerHour: z.number().min(0, "Price cannot be negative"),
  maxStudents: z.number().min(1, "Package must allow at least 1 student"),
  validityPeriod: z.number().min(1, "Package must be valid for at least 1 day"),
});

export const insertSubjectSchema = createInsertSchema(subjects).omit({
  id: true,
}).extend({
  level: z.enum(["Elementary", "Middle School", "High School", "College"]),
  category: z.enum(["Mathematics", "Science", "Languages", "Arts", "Social Studies", "Test Prep"]),
  imageUrl: z.string().url().optional(),
});

export const insertBookingSchema = createInsertSchema(bookings).omit({
  id: true,
  status: true,
  remainingHours: true,
}).extend({
  startDate: z.date(),
  endDate: z.date(),
  notes: z.string().optional(),
  zoomLink: z.string().url().optional(),
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