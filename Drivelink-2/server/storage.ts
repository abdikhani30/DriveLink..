import { 
  users, vehicles, drivers, parkingSessions, carPark, serviceRecords, fines,
  type User, type InsertUser,
  type Vehicle, type InsertVehicle,
  type Driver, type InsertDriver,
  type ParkingSession, type InsertParkingSession,
  type CarPark, type InsertCarPark,
  type ServiceRecord, type InsertServiceRecord,
  type Fine, type InsertFine
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Vehicles
  getVehiclesByUserId(userId: number): Promise<Vehicle[]>;
  getVehicle(id: number): Promise<Vehicle | undefined>;
  createVehicle(vehicle: InsertVehicle): Promise<Vehicle>;

  // Drivers
  getDriversByVehicleId(vehicleId: number): Promise<Driver[]>;
  getActiveDriver(vehicleId: number): Promise<Driver | undefined>;
  createDriver(driver: InsertDriver): Promise<Driver>;
  updateDriverStatus(id: number, isActive: boolean): Promise<Driver | undefined>;

  // Parking Sessions
  getParkingSessionsByVehicleId(vehicleId: number): Promise<ParkingSession[]>;
  getActiveParkingSession(vehicleId: number): Promise<ParkingSession | undefined>;
  createParkingSession(session: InsertParkingSession): Promise<ParkingSession>;
  updateParkingSession(id: number, updates: Partial<ParkingSession>): Promise<ParkingSession | undefined>;

  // Car Parks
  getAllCarParks(): Promise<CarPark[]>;
  getNearbyCarParks(lat: number, lng: number, radius: number): Promise<CarPark[]>;
  getCarPark(id: number): Promise<CarPark | undefined>;
  updateCarParkSpaces(id: number, availableSpaces: number): Promise<CarPark | undefined>;

  // Service Records
  getServiceRecordsByVehicleId(vehicleId: number): Promise<ServiceRecord[]>;
  createServiceRecord(record: InsertServiceRecord): Promise<ServiceRecord>;
  getNextServiceDue(vehicleId: number): Promise<ServiceRecord | undefined>;

  // Fines
  getFinesByVehicleId(vehicleId: number): Promise<Fine[]>;
  getOutstandingFines(vehicleId: number): Promise<Fine[]>;
  createFine(fine: InsertFine): Promise<Fine>;
  updateFineStatus(id: number, status: string, paymentDate?: Date): Promise<Fine | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User> = new Map();
  private vehicles: Map<number, Vehicle> = new Map();
  private drivers: Map<number, Driver> = new Map();
  private parkingSessions: Map<number, ParkingSession> = new Map();
  private carParks: Map<number, CarPark> = new Map();
  private serviceRecords: Map<number, ServiceRecord> = new Map();
  private fines: Map<number, Fine> = new Map();
  
  private currentUserId = 1;
  private currentVehicleId = 1;
  private currentDriverId = 1;
  private currentParkingSessionId = 1;
  private currentCarParkId = 1;
  private currentServiceRecordId = 1;
  private currentFineId = 1;

  constructor() {
    this.seedData();
  }

  private seedData() {
    // Create sample user
    const user: User = {
      id: 1,
      username: "johndoe",
      email: "john.doe@email.com",
      password: "hashedpassword",
      firstName: "John",
      lastName: "Doe",
      createdAt: new Date(),
    };
    this.users.set(1, user);
    this.currentUserId = 2;

    // Create sample vehicles
    const vehicles: Vehicle[] = [
      {
        id: 1,
        userId: 1,
        registration: "SF90 RFR",
        make: "Ferrari",
        model: "SF90 Stradale",
        year: 2020,
        color: "Rosso Corsa Red",
        createdAt: new Date(),
      },
      {
        id: 2,
        userId: 1,
        registration: "AMG 63S",
        make: "Mercedes-AMG",
        model: "GT 63 S",
        year: 2022,
        color: "Magnetite Black",
        createdAt: new Date(),
      },
      {
        id: 3,
        userId: 1,
        registration: "M3 CSL",
        make: "BMW",
        model: "M3 CSL",
        year: 2023,
        color: "Alpine White",
        createdAt: new Date(),
      }
    ];
    
    vehicles.forEach(vehicle => this.vehicles.set(vehicle.id, vehicle));
    this.currentVehicleId = 4;

    // Create sample drivers for multiple vehicles
    const drivers: Driver[] = [
      // Ferrari SF90 Stradale drivers
      {
        id: 1,
        vehicleId: 1,
        name: "Marcus (son)",
        relationship: "Son",
        isActive: true,
        createdAt: new Date(),
      },
      {
        id: 2,
        vehicleId: 1,
        name: "Sarah (daughter)",
        relationship: "Daughter",
        isActive: false,
        createdAt: new Date(),
      },
      {
        id: 3,
        vehicleId: 1,
        name: "John Doe",
        relationship: "Owner",
        isActive: false,
        createdAt: new Date(),
      },
      // Mercedes-AMG GT 63 S drivers
      {
        id: 4,
        vehicleId: 2,
        name: "John Doe",
        relationship: "Owner",
        isActive: true,
        createdAt: new Date(),
      },
      {
        id: 5,
        vehicleId: 2,
        name: "Sarah (daughter)",
        relationship: "Daughter",
        isActive: false,
        createdAt: new Date(),
      },
      // BMW M3 CSL drivers
      {
        id: 6,
        vehicleId: 3,
        name: "John Doe",
        relationship: "Owner",
        isActive: true,
        createdAt: new Date(),
      },
    ];
    drivers.forEach(driver => this.drivers.set(driver.id, driver));
    this.currentDriverId = 7;

    // Create sample car parks
    const carParks: CarPark[] = [
      {
        id: 1,
        name: "Central Mall - P1",
        location: "0.2 miles",
        latitude: "51.5074",
        longitude: "-0.1278",
        totalSpaces: 200,
        availableSpaces: 47,
        hourlyRate: "2.50",
        status: "available",
      },
      {
        id: 2,
        name: "City Center - Level 2",
        location: "0.4 miles",
        latitude: "51.5084",
        longitude: "-0.1288",
        totalSpaces: 150,
        availableSpaces: 8,
        hourlyRate: "3.00",
        status: "limited",
      },
      {
        id: 3,
        name: "Station Car Park",
        location: "0.6 miles",
        latitude: "51.5094",
        longitude: "-0.1298",
        totalSpaces: 100,
        availableSpaces: 0,
        hourlyRate: "1.80",
        status: "full",
      },
    ];
    carParks.forEach(park => this.carParks.set(park.id, park));
    this.currentCarParkId = 4;

    // Create sample service records
    const serviceRecords: ServiceRecord[] = [
      {
        id: 1,
        vehicleId: 1,
        serviceType: "Annual Service",
        provider: "Johnson's Garage",
        serviceDate: new Date("2024-03-15"),
        cost: "245.00",
        notes: "Full service completed",
        nextServiceDue: new Date("2025-03-15"),
        status: "completed",
      },
      {
        id: 2,
        vehicleId: 1,
        serviceType: "Oil Change",
        provider: "QuickLube Express",
        serviceDate: new Date("2024-01-08"),
        cost: "35.00",
        notes: "Engine oil and filter changed",
        nextServiceDue: new Date("2024-07-08"),
        status: "completed",
      },
      {
        id: 3,
        vehicleId: 1,
        serviceType: "Tire Replacement",
        provider: "City Tire Center",
        serviceDate: new Date("2023-12-03"),
        cost: "320.00",
        notes: "All four tires replaced",
        nextServiceDue: null,
        status: "completed",
      },
    ];
    serviceRecords.forEach(record => this.serviceRecords.set(record.id, record));
    this.currentServiceRecordId = 4;

    // Create sample fines
    const fines: Fine[] = [
      {
        id: 1,
        vehicleId: 1,
        fineType: "Parking Violation",
        location: "Oxford Street",
        issueDate: new Date("2024-03-28"),
        amount: "80.00",
        dueDate: new Date("2024-04-11"),
        description: "Expired meter - 2 hours over limit",
        status: "pending",
        evidenceUrl: "evidence1.jpg",
        paymentDate: null,
      },
      {
        id: 2,
        vehicleId: 1,
        fineType: "Speed Camera",
        location: "A40 Westway",
        issueDate: new Date("2024-03-25"),
        amount: "40.00",
        dueDate: new Date("2024-04-08"),
        description: "37 mph in 30 mph zone",
        status: "pending",
        evidenceUrl: "evidence2.jpg",
        paymentDate: null,
      },
      {
        id: 3,
        vehicleId: 1,
        fineType: "Parking Violation",
        location: "King's Road",
        issueDate: new Date("2024-02-15"),
        amount: "60.00",
        dueDate: new Date("2024-03-01"),
        description: "No valid ticket displayed",
        status: "paid",
        evidenceUrl: "evidence3.jpg",
        paymentDate: new Date("2024-02-18"),
      },
    ];
    fines.forEach(fine => this.fines.set(fine.id, fine));
    this.currentFineId = 4;

    // Create active parking session
    const activeSession: ParkingSession = {
      id: 1,
      vehicleId: 1,
      driverId: 1,
      location: "P-127",
      carParkNumber: "P-127",
      startTime: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      endTime: null,
      hourlyRate: "2.50",
      totalCost: null,
      status: "active",
      paymentStatus: "unpaid",
    };
    this.parkingSessions.set(1, activeSession);
    this.currentParkingSessionId = 2;
  }

  // Users
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id, createdAt: new Date() };
    this.users.set(id, user);
    return user;
  }

  // Vehicles
  async getVehiclesByUserId(userId: number): Promise<Vehicle[]> {
    return Array.from(this.vehicles.values()).filter(vehicle => vehicle.userId === userId);
  }

  async getVehicle(id: number): Promise<Vehicle | undefined> {
    return this.vehicles.get(id);
  }

  async createVehicle(insertVehicle: InsertVehicle): Promise<Vehicle> {
    const id = this.currentVehicleId++;
    const vehicle: Vehicle = { ...insertVehicle, id, createdAt: new Date() };
    this.vehicles.set(id, vehicle);
    return vehicle;
  }

  // Drivers
  async getDriversByVehicleId(vehicleId: number): Promise<Driver[]> {
    return Array.from(this.drivers.values()).filter(driver => driver.vehicleId === vehicleId);
  }

  async getActiveDriver(vehicleId: number): Promise<Driver | undefined> {
    return Array.from(this.drivers.values()).find(driver => 
      driver.vehicleId === vehicleId && driver.isActive
    );
  }

  async createDriver(insertDriver: InsertDriver): Promise<Driver> {
    const id = this.currentDriverId++;
    const driver: Driver = { 
      ...insertDriver, 
      id, 
      createdAt: new Date(),
      isActive: insertDriver.isActive ?? false
    };
    this.drivers.set(id, driver);
    return driver;
  }

  async updateDriverStatus(id: number, isActive: boolean): Promise<Driver | undefined> {
    const driver = this.drivers.get(id);
    if (!driver) return undefined;
    
    if (isActive) {
      // Deactivate other drivers for the same vehicle
      Array.from(this.drivers.values())
        .filter(d => d.vehicleId === driver.vehicleId && d.id !== id)
        .forEach(d => d.isActive = false);
    }
    
    driver.isActive = isActive;
    return driver;
  }

  // Parking Sessions
  async getParkingSessionsByVehicleId(vehicleId: number): Promise<ParkingSession[]> {
    return Array.from(this.parkingSessions.values())
      .filter(session => session.vehicleId === vehicleId)
      .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());
  }

  async getActiveParkingSession(vehicleId: number): Promise<ParkingSession | undefined> {
    return Array.from(this.parkingSessions.values()).find(session => 
      session.vehicleId === vehicleId && session.status === "active"
    );
  }

  async createParkingSession(insertSession: InsertParkingSession): Promise<ParkingSession> {
    const id = this.currentParkingSessionId++;
    const session: ParkingSession = { 
      ...insertSession, 
      id, 
      startTime: new Date(),
      endTime: insertSession.endTime ?? null,
      totalCost: insertSession.totalCost ?? null,
      status: insertSession.status ?? "active",
      paymentStatus: insertSession.paymentStatus ?? "unpaid"
    };
    this.parkingSessions.set(id, session);
    return session;
  }

  async updateParkingSession(id: number, updates: Partial<ParkingSession>): Promise<ParkingSession | undefined> {
    const session = this.parkingSessions.get(id);
    if (!session) return undefined;
    
    Object.assign(session, updates);
    return session;
  }

  // Car Parks
  async getAllCarParks(): Promise<CarPark[]> {
    return Array.from(this.carParks.values());
  }

  async getNearbyCarParks(lat: number, lng: number, radius: number): Promise<CarPark[]> {
    // Simple distance calculation for demo
    return Array.from(this.carParks.values());
  }

  async getCarPark(id: number): Promise<CarPark | undefined> {
    return this.carParks.get(id);
  }

  async updateCarParkSpaces(id: number, availableSpaces: number): Promise<CarPark | undefined> {
    const carPark = this.carParks.get(id);
    if (!carPark) return undefined;
    
    carPark.availableSpaces = availableSpaces;
    
    // Update status based on availability
    if (availableSpaces === 0) {
      carPark.status = "full";
    } else if (availableSpaces < carPark.totalSpaces * 0.2) {
      carPark.status = "limited";
    } else {
      carPark.status = "available";
    }
    
    return carPark;
  }

  // Service Records
  async getServiceRecordsByVehicleId(vehicleId: number): Promise<ServiceRecord[]> {
    return Array.from(this.serviceRecords.values())
      .filter(record => record.vehicleId === vehicleId)
      .sort((a, b) => new Date(b.serviceDate).getTime() - new Date(a.serviceDate).getTime());
  }

  async createServiceRecord(insertRecord: InsertServiceRecord): Promise<ServiceRecord> {
    const id = this.currentServiceRecordId++;
    const record: ServiceRecord = { 
      ...insertRecord, 
      id,
      status: insertRecord.status ?? "completed",
      notes: insertRecord.notes ?? null,
      nextServiceDue: insertRecord.nextServiceDue ?? null
    };
    this.serviceRecords.set(id, record);
    return record;
  }

  async getNextServiceDue(vehicleId: number): Promise<ServiceRecord | undefined> {
    const records = Array.from(this.serviceRecords.values())
      .filter(record => record.vehicleId === vehicleId && record.nextServiceDue)
      .sort((a, b) => new Date(a.nextServiceDue!).getTime() - new Date(b.nextServiceDue!).getTime());
    
    return records[0];
  }

  // Fines
  async getFinesByVehicleId(vehicleId: number): Promise<Fine[]> {
    return Array.from(this.fines.values())
      .filter(fine => fine.vehicleId === vehicleId)
      .sort((a, b) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime());
  }

  async getOutstandingFines(vehicleId: number): Promise<Fine[]> {
    return Array.from(this.fines.values())
      .filter(fine => fine.vehicleId === vehicleId && fine.status !== "paid");
  }

  async createFine(insertFine: InsertFine): Promise<Fine> {
    const id = this.currentFineId++;
    const fine: Fine = { 
      ...insertFine, 
      id,
      status: insertFine.status ?? "pending",
      evidenceUrl: insertFine.evidenceUrl ?? null,
      paymentDate: insertFine.paymentDate ?? null
    };
    this.fines.set(id, fine);
    return fine;
  }

  async updateFineStatus(id: number, status: string, paymentDate?: Date): Promise<Fine | undefined> {
    const fine = this.fines.get(id);
    if (!fine) return undefined;
    
    fine.status = status;
    if (paymentDate) {
      fine.paymentDate = paymentDate;
    }
    
    return fine;
  }
}

export const storage = new MemStorage();
