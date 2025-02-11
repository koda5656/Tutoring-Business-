import { drizzle } from "drizzle-orm/node-postgres";
import { sql } from "drizzle-orm";
import { Client } from "@neondatabase/serverless";
import { users, packages, subjects, bookings } from "@shared/schema";
import type { User, InsertUser, Package, InsertPackage, Subject, InsertSubject, Booking, InsertBooking } from "@shared/schema";
import session from "express-session";
import connectPg from "connect-pg-simple";

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
  private db: ReturnType<typeof drizzle>;
  sessionStore: session.Store;

  constructor() {
    const client = new Client({ connectionString: process.env.DATABASE_URL! });
    client.connect().then(() => {
      this.db = drizzle(client);
    });

    this.sessionStore = new PostgresSessionStore({
      conObject: {
        connectionString: process.env.DATABASE_URL,
      },
      createTableIfMissing: true,
    });
  }

  private async getDb() {
    if (!this.db) {
      throw new Error("Database not initialized");
    }
    return this.db;
  }

  async getUser(id: number): Promise<User | undefined> {
    const db = await this.getDb();
    const result = await db.select().from(users).where(sql`${users.id} = ${id}`).limit(1);
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const db = await this.getDb();
    const result = await db.select().from(users).where(sql`${users.username} = ${username}`).limit(1);
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const db = await this.getDb();
    const result = await db.insert(users).values({
      ...insertUser,
      isAdmin: false,
    }).returning();
    return result[0];
  }

  async getPackage(id: number): Promise<Package | undefined> {
    const db = await this.getDb();
    const result = await db.select().from(packages).where(sql`${packages.id} = ${id}`).limit(1);
    return result[0];
  }

  async getAllPackages(): Promise<Package[]> {
    const db = await this.getDb();
    return await db.select().from(packages);
  }

  async createPackage(pkg: InsertPackage): Promise<Package> {
    const db = await this.getDb();
    const result = await db.insert(packages).values(pkg).returning();
    return result[0];
  }

  async getSubject(id: number): Promise<Subject | undefined> {
    const db = await this.getDb();
    const result = await db.select().from(subjects).where(sql`${subjects.id} = ${id}`).limit(1);
    return result[0];
  }

  async getAllSubjects(): Promise<Subject[]> {
    const db = await this.getDb();
    return await db.select().from(subjects);
  }

  async createSubject(subject: InsertSubject): Promise<Subject> {
    const db = await this.getDb();
    const result = await db.insert(subjects).values(subject).returning();
    return result[0];
  }

  async getBooking(id: number): Promise<Booking | undefined> {
    const db = await this.getDb();
    const result = await db.select().from(bookings).where(sql`${bookings.id} = ${id}`).limit(1);
    return result[0];
  }

  async getUserBookings(userId: number): Promise<Booking[]> {
    const db = await this.getDb();
    return await db.select().from(bookings).where(sql`${bookings.userId} = ${userId}`);
  }

  async createBooking(booking: InsertBooking): Promise<Booking> {
    const db = await this.getDb();
    const result = await db.insert(bookings).values({
      ...booking,
      status: "pending",
    }).returning();
    return result[0];
  }

  async updateBookingStatus(id: number, status: string): Promise<Booking | undefined> {
    const db = await this.getDb();
    const result = await db.update(bookings)
      .set({ status })
      .where(sql`${bookings.id} = ${id}`)
      .returning();
    return result[0];
  }
}

// Export a single instance of the storage
export const storage = new DatabaseStorage();