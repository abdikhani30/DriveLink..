import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertParkingSessionSchema, insertServiceRecordSchema, insertDriverSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // User routes
  app.get("/api/user", async (req, res) => {
    try {
      const user = await storage.getUser(1); // Default user for demo
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user" });
    }
  });

  // Vehicle routes
  app.get("/api/vehicles", async (req, res) => {
    try {
      const vehicles = await storage.getVehiclesByUserId(1);
      res.json(vehicles);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch vehicles" });
    }
  });

  app.get("/api/vehicles/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const vehicle = await storage.getVehicle(id);
      if (!vehicle) {
        return res.status(404).json({ error: "Vehicle not found" });
      }
      res.json(vehicle);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch vehicle" });
    }
  });

  // Driver routes
  app.get("/api/vehicles/:vehicleId/drivers", async (req, res) => {
    try {
      const vehicleId = parseInt(req.params.vehicleId);
      const drivers = await storage.getDriversByVehicleId(vehicleId);
      res.json(drivers);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch drivers" });
    }
  });

  app.get("/api/vehicles/:vehicleId/active-driver", async (req, res) => {
    try {
      const vehicleId = parseInt(req.params.vehicleId);
      const driver = await storage.getActiveDriver(vehicleId);
      res.json(driver);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch active driver" });
    }
  });

  app.post("/api/drivers", async (req, res) => {
    try {
      const driverData = insertDriverSchema.parse(req.body);
      const driver = await storage.createDriver(driverData);
      res.json(driver);
    } catch (error) {
      res.status(400).json({ error: "Invalid driver data" });
    }
  });

  app.patch("/api/drivers/:id/status", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { isActive } = req.body;
      const driver = await storage.updateDriverStatus(id, isActive);
      if (!driver) {
        return res.status(404).json({ error: "Driver not found" });
      }
      res.json(driver);
    } catch (error) {
      res.status(500).json({ error: "Failed to update driver status" });
    }
  });

  // Car park routes
  app.get("/api/car-parks", async (req, res) => {
    try {
      const carParks = await storage.getAllCarParks();
      res.json(carParks);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch car parks" });
    }
  });

  app.get("/api/car-parks/nearby", async (req, res) => {
    try {
      const { lat, lng, radius = 5 } = req.query;
      const carParks = await storage.getNearbyCarParks(
        parseFloat(lat as string),
        parseFloat(lng as string),
        parseInt(radius as string)
      );
      res.json(carParks);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch nearby car parks" });
    }
  });

  // Parking session routes
  app.get("/api/vehicles/:vehicleId/parking-sessions", async (req, res) => {
    try {
      const vehicleId = parseInt(req.params.vehicleId);
      const sessions = await storage.getParkingSessionsByVehicleId(vehicleId);
      res.json(sessions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch parking sessions" });
    }
  });

  app.get("/api/vehicles/:vehicleId/active-parking", async (req, res) => {
    try {
      const vehicleId = parseInt(req.params.vehicleId);
      const session = await storage.getActiveParkingSession(vehicleId);
      res.json(session);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch active parking session" });
    }
  });

  app.post("/api/parking-sessions", async (req, res) => {
    try {
      const sessionData = insertParkingSessionSchema.parse(req.body);
      const session = await storage.createParkingSession(sessionData);
      res.json(session);
    } catch (error) {
      res.status(400).json({ error: "Invalid parking session data" });
    }
  });

  app.patch("/api/parking-sessions/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      const session = await storage.updateParkingSession(id, updates);
      if (!session) {
        return res.status(404).json({ error: "Parking session not found" });
      }
      res.json(session);
    } catch (error) {
      res.status(500).json({ error: "Failed to update parking session" });
    }
  });

  // Service record routes
  app.get("/api/vehicles/:vehicleId/service-records", async (req, res) => {
    try {
      const vehicleId = parseInt(req.params.vehicleId);
      const records = await storage.getServiceRecordsByVehicleId(vehicleId);
      res.json(records);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch service records" });
    }
  });

  app.get("/api/vehicles/:vehicleId/next-service", async (req, res) => {
    try {
      const vehicleId = parseInt(req.params.vehicleId);
      const nextService = await storage.getNextServiceDue(vehicleId);
      res.json(nextService);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch next service due" });
    }
  });

  app.post("/api/service-records", async (req, res) => {
    try {
      const recordData = insertServiceRecordSchema.parse(req.body);
      const record = await storage.createServiceRecord(recordData);
      res.json(record);
    } catch (error) {
      res.status(400).json({ error: "Invalid service record data" });
    }
  });

  // Felix AI Chat route
  app.post("/api/felix/chat", async (req, res) => {
    try {
      const { message, conversation } = req.body;
      
      // For now, we'll use a more intelligent mock response
      // In production, you would integrate with OpenAI, Claude, etc.
      const responses = [
        "I can help you diagnose that issue. Based on your Ferrari SF90 Stradale's symptoms, let me guide you through some troubleshooting steps. First, can you tell me if you're hearing any unusual sounds from the engine bay?",
        "That sounds like it could be related to the hybrid system. Let me walk you through a diagnostic process: 1) Check the dashboard for any warning lights, 2) Listen for unusual sounds when the electric motors engage, 3) Feel for any vibrations during acceleration. What are you noticing?",
        "For the SF90 Stradale, this is a common issue. Here's what I recommend: First, make sure the vehicle is in Race mode to get full system diagnostics. Then check the infotainment system under 'Vehicle Status' for any error codes. Can you access that menu?",
        "Let me help you troubleshoot this step by step. Since this is a hybrid Ferrari, we need to check both the V8 engine and the electric motor systems. Start by checking if the issue occurs in electric-only mode (eDrive). Does the problem persist when running purely on electric power?",
        "Based on your description, I'd like to guide you through Ferrari's built-in diagnostic sequence. First, with the engine off, press and hold the steering wheel controls while turning the key to position II. This will run a system check. What codes or messages do you see?"
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      setTimeout(() => {
        res.json({ 
          response: randomResponse,
          timestamp: new Date().toISOString()
        });
      }, 1000 + Math.random() * 1500); // Simulate AI thinking time
      
    } catch (error) {
      res.status(500).json({ error: "Failed to process AI request" });
    }
  });

  // Fine routes
  app.get("/api/vehicles/:vehicleId/fines", async (req, res) => {
    try {
      const vehicleId = parseInt(req.params.vehicleId);
      const fines = await storage.getFinesByVehicleId(vehicleId);
      res.json(fines);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch fines" });
    }
  });

  app.get("/api/vehicles/:vehicleId/outstanding-fines", async (req, res) => {
    try {
      const vehicleId = parseInt(req.params.vehicleId);
      const fines = await storage.getOutstandingFines(vehicleId);
      res.json(fines);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch outstanding fines" });
    }
  });

  app.patch("/api/fines/:id/pay", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { paymentMethod } = req.body;
      
      // Simulate payment processing
      const fine = await storage.updateFineStatus(id, "paid", new Date());
      if (!fine) {
        return res.status(404).json({ error: "Fine not found" });
      }
      
      res.json({ success: true, fine, paymentMethod });
    } catch (error) {
      res.status(500).json({ error: "Failed to process payment" });
    }
  });

  app.patch("/api/fines/:id/appeal", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { reason } = req.body;
      
      const fine = await storage.updateFineStatus(id, "appealed");
      if (!fine) {
        return res.status(404).json({ error: "Fine not found" });
      }
      
      res.json({ success: true, fine, appealReason: reason });
    } catch (error) {
      res.status(500).json({ error: "Failed to submit appeal" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
