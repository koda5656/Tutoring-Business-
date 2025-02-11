import { drizzle } from "drizzle-orm/node-postgres";
import { sql } from "drizzle-orm";
import { users, packages, subjects, bookings } from "@shared/schema";
import type { User, InsertUser, Package, InsertPackage, Subject, InsertSubject, Booking, InsertBooking } from "@shared/schema";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { db } from "./db";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Package operations
  getPackage(id: number): Promise<Package | undefined>;
  getAllPackages(): Promise<Package[]>;
  createPackage(pkg: InsertPackage): Promise<Package>;

  // Subject operations
  getSubject(id: number): Promise<Subject | undefined>;
  getAllSubjects(): Promise<Subject[]>;
  createSubject(subject: InsertSubject): Promise<Subject>;

  // Booking operations
  getBooking(id: number): Promise<Booking | undefined>;
  getUserBookings(userId: number): Promise<Booking[]>;
  createBooking(booking: InsertBooking): Promise<Booking>;
  updateBookingStatus(id: number, status: string): Promise<Booking | undefined>;

  // Session store for auth
  sessionStore: session.Store;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresSessionStore({
      conObject: {
        connectionString: process.env.DATABASE_URL,
      },
      createTableIfMissing: true,
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(sql`${users.id} = ${id}`);
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(sql`${users.username} = ${username}`);
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users)
      .values({
        ...insertUser,
        isAdmin: false,
      })
      .returning();
    return user;
  }

  async getPackage(id: number): Promise<Package | undefined> {
    const [pkg] = await db.select().from(packages).where(sql`${packages.id} = ${id}`);
    return pkg;
  }

  async getAllPackages(): Promise<Package[]> {
    return await db.select().from(packages);
  }

  async createPackage(pkg: InsertPackage): Promise<Package> {
    const [newPkg] = await db.insert(packages).values(pkg).returning();
    return newPkg;
  }

  async getSubject(id: number): Promise<Subject | undefined> {
    const [subject] = await db.select().from(subjects).where(sql`${subjects.id} = ${id}`);
    return subject;
  }

  async getAllSubjects(): Promise<Subject[]> {
    return await db.select().from(subjects);
  }

  async createSubject(subject: InsertSubject): Promise<Subject> {
    const [newSubject] = await db.insert(subjects).values(subject).returning();
    return newSubject;
  }

  async getBooking(id: number): Promise<Booking | undefined> {
    const [booking] = await db.select().from(bookings).where(sql`${bookings.id} = ${id}`);
    return booking;
  }

  async getUserBookings(userId: number): Promise<Booking[]> {
    return await db.select().from(bookings).where(sql`${bookings.userId} = ${userId}`);
  }

  async createBooking(booking: InsertBooking): Promise<Booking> {
    const [newBooking] = await db.insert(bookings)
      .values({
        ...booking,
        status: "pending",
      })
      .returning();
    return newBooking;
  }

  async updateBookingStatus(id: number, status: string): Promise<Booking | undefined> {
    const [updated] = await db.update(bookings)
      .set({ status })
      .where(sql`${bookings.id} = ${id}`)
      .returning();
    return updated;
  }
}

// Export a single instance of the storage
export const storage = new DatabaseStorage();