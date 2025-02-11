import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { insertBookingSchema, insertPackageSchema, insertSubjectSchema } from "@shared/schema";

export function registerRoutes(app: Express): Server {
  // sets up /api/register, /api/login, /api/logout, /api/user
  setupAuth(app);

  // Package routes
  app.get("/api/packages", async (req, res) => {
    const packages = await storage.getAllPackages();
    res.json(packages);
  });

  app.get("/api/packages/:id", async (req, res) => {
    const pkg = await storage.getPackage(Number(req.params.id));
    if (!pkg) return res.status(404).send("Package not found");
    res.json(pkg);
  });

  // Subject routes
  app.get("/api/subjects", async (req, res) => {
    const subjects = await storage.getAllSubjects();
    res.json(subjects);
  });

  app.get("/api/subjects/:id", async (req, res) => {
    const subject = await storage.getSubject(Number(req.params.id));
    if (!subject) return res.status(404).send("Subject not found");
    res.json(subject);
  });

  // Booking routes - these require authentication
  app.post("/api/bookings", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    try {
      const booking = insertBookingSchema.parse({
        ...req.body,
        userId: req.user!.id,
      });
      const newBooking = await storage.createBooking(booking);
      res.status(201).json(newBooking);
    } catch (error) {
      res.status(400).json({ error: "Invalid booking data" });
    }
  });

  app.get("/api/bookings", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const bookings = await storage.getUserBookings(req.user!.id);
    res.json(bookings);
  });

  // Admin routes - these require admin authentication
  app.post("/api/packages", async (req, res) => {
    if (!req.isAuthenticated() || !req.user!.isAdmin) return res.sendStatus(403);

    try {
      const pkg = insertPackageSchema.parse(req.body);
      const newPackage = await storage.createPackage(pkg);
      res.status(201).json(newPackage);
    } catch (error) {
      res.status(400).json({ error: "Invalid package data" });
    }
  });

  app.post("/api/subjects", async (req, res) => {
    if (!req.isAuthenticated() || !req.user!.isAdmin) return res.sendStatus(403);

    try {
      const subject = insertSubjectSchema.parse(req.body);
      const newSubject = await storage.createSubject(subject);
      res.status(201).json(newSubject);
    } catch (error) {
      res.status(400).json({ error: "Invalid subject data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}