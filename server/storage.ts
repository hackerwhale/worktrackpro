import { eq, and, desc, like, or, isNull, ne } from "drizzle-orm";
import { db } from "./db.js";
import {
  users, User, InsertUser,
  attendance, Attendance, InsertAttendance,
  tasks, Task, InsertTask,
  notes, Note, InsertNote,
  photos, Photo, InsertPhoto,
  activities, Activity, InsertActivity
} from "../shared/schema.js";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllUsers(): Promise<User[]>;
  updateUser(id: number, userData: Partial<User>): Promise<User | undefined>;
  deleteUser(id: number): Promise<boolean>;

  // Attendance operations
  getAttendance(id: number): Promise<Attendance | undefined>;
  getAttendanceByUserAndDate(userId: number, date: string): Promise<Attendance | undefined>;
  createAttendance(attendance: InsertAttendance): Promise<Attendance>;
  updateAttendance(id: number, attendanceData: Partial<Attendance>): Promise<Attendance | undefined>;
  getTodaysAttendance(date: string): Promise<Attendance[]>;

  // Task operations
  getTask(id: number): Promise<Task | undefined>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: number, taskData: Partial<Task>): Promise<Task | undefined>;
  deleteTask(id: number): Promise<boolean>;
  getTasksByUser(userId: number): Promise<Task[]>;
  getAllTasks(): Promise<Task[]>;
  getRecentTasks(limit: number): Promise<Task[]>;

  // Note operations
  getNotesByTask(taskId: number): Promise<Note[]>;
  createNote(note: InsertNote): Promise<Note>;

  // Photo operations
  getPhotosByTask(taskId: number): Promise<Photo[]>;
  createPhoto(photo: InsertPhoto): Promise<Photo>;

  // Activity operations
  getRecentActivities(limit: number): Promise<Activity[]>;
  createActivity(activity: InsertActivity): Promise<Activity>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    if (typeof id !== "number") return undefined;
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(userData: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(userData).returning();
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    if (typeof id !== "number") return undefined;
    const [updatedUser] = await db
      .update(users)
      .set(userData)
      .where(eq(users.id, id))
      .returning();
    return updatedUser;
  }

  async deleteUser(id: number): Promise<boolean> {
    if (typeof id !== "number") return false;
    const [deletedUser] = await db
      .delete(users)
      .where(eq(users.id, id))
      .returning();
    return !!deletedUser;
  }

  // Attendance operations
  async getAttendance(id: number): Promise<Attendance | undefined> {
    if (typeof id !== "number") return undefined;
    const [attendanceRecord] = await db
      .select()
      .from(attendance)
      .where(eq(attendance.id, id));
    return attendanceRecord;
  }

  async getAttendanceByUserAndDate(userId: number, date: string): Promise<Attendance | undefined> {
    if (typeof userId !== "number" || !date) return undefined;
    const [attendanceRecord] = await db
      .select()
      .from(attendance)
      .where(and(
        eq(attendance.userId, userId),
        eq(attendance.date, date)
      ));
    return attendanceRecord;
  }

  async createAttendance(attendanceData: InsertAttendance): Promise<Attendance> {
    const [newAttendance] = await db
      .insert(attendance)
      .values(attendanceData)
      .returning();
    return newAttendance;
  }

  async updateAttendance(id: number, attendanceData: Partial<Attendance>): Promise<Attendance | undefined> {
    const [updatedAttendance] = await db
      .update(attendance)
      .set(attendanceData)
      .where(eq(attendance.id, id))
      .returning();
    return updatedAttendance;
  }

  async getTodaysAttendance(date: string): Promise<Attendance[]> {
    return await db
      .select()
      .from(attendance)
      .where(eq(attendance.date, date));
  }

  // Task operations
  async getTask(id: number): Promise<Task | undefined> {
    const [task] = await db
      .select()
      .from(tasks)
      .where(eq(tasks.id, id));
    return task;
  }

  async createTask(taskData: InsertTask): Promise<Task> {
    const [newTask] = await db
      .insert(tasks)
      .values(taskData)
      .returning();
    return newTask;
  }

  async updateTask(id: number, taskData: Partial<Task>): Promise<Task | undefined> {
    const [updatedTask] = await db
      .update(tasks)
      .set(taskData)
      .where(eq(tasks.id, id))
      .returning();
    return updatedTask;
  }

  async deleteTask(id: number): Promise<boolean> {
    const [deletedTask] = await db
      .delete(tasks)
      .where(eq(tasks.id, id))
      .returning();
    return !!deletedTask;
  }

  async getTasksByUser(userId: number): Promise<Task[]> {
    return await db
      .select()
      .from(tasks)
      .where(eq(tasks.assignedTo, userId))
      .orderBy(desc(tasks.createdAt));
  }

  async getAllTasks(): Promise<Task[]> {
    return await db
      .select()
      .from(tasks)
      .orderBy(desc(tasks.createdAt));
  }

  async getRecentTasks(limit: number): Promise<Task[]> {
    return await db
      .select()
      .from(tasks)
      .orderBy(desc(tasks.createdAt))
      .limit(limit);
  }

  // Note operations
  async getNotesByTask(taskId: number): Promise<Note[]> {
    return await db
      .select()
      .from(notes)
      .where(eq(notes.taskId, taskId))
      .orderBy(desc(notes.createdAt));
  }

  async createNote(noteData: InsertNote): Promise<Note> {
    const [newNote] = await db
      .insert(notes)
      .values(noteData)
      .returning();
    return newNote;
  }

  // Photo operations
  async getPhotosByTask(taskId: number): Promise<Photo[]> {
    return await db
      .select()
      .from(photos)
      .where(eq(photos.taskId, taskId))
      .orderBy(desc(photos.createdAt));
  }

  async createPhoto(photoData: InsertPhoto): Promise<Photo> {
    const [newPhoto] = await db
      .insert(photos)
      .values(photoData)
      .returning();
    return newPhoto;
  }

  // Activity operations
  async getRecentActivities(limit: number): Promise<Activity[]> {
    return await db
      .select()
      .from(activities)
      .orderBy(desc(activities.createdAt))
      .limit(limit);
  }

  async createActivity(activityData: InsertActivity): Promise<Activity> {
    const [newActivity] = await db
      .insert(activities)
      .values(activityData)
      .returning();
    return newActivity;
  }
}

// For simplicity, let's use MemStorage for development
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private attendance: Map<number, Attendance>;
  private tasks: Map<number, Task>;
  private notes: Map<number, Note>;
  private photos: Map<number, Photo>;
  private activities: Map<number, Activity>;
  private currentUserId: number;
  private currentAttendanceId: number;
  private currentTaskId: number;
  private currentNoteId: number;
  private currentPhotoId: number;
  private currentActivityId: number;

  constructor() {
    this.users = new Map();
    this.attendance = new Map();
    this.tasks = new Map();
    this.notes = new Map();
    this.photos = new Map();
    this.activities = new Map();
    this.currentUserId = 1;
    this.currentAttendanceId = 1;
    this.currentTaskId = 1;
    this.currentNoteId = 1;
    this.currentPhotoId = 1;
    this.currentActivityId = 1;

    // Add sample admin user
    this.users.set(1, {
      id: 1,
      username: "admin",
      password: "admin123",
      firstName: "John",
      lastName: "Smith",
      email: "admin@example.com",
      role: "admin",
      position: "Administrator",
      profileImageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=400"
    });

    // Add sample employees
    this.users.set(2, {
      id: 2,
      username: "sarah",
      password: "sarah123",
      firstName: "Sarah",
      lastName: "Johnson",
      email: "sarah@example.com",
      role: "employee",
      position: "Project Manager",
      profileImageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100"
    });

    this.users.set(3, {
      id: 3,
      username: "michael",
      password: "michael123",
      firstName: "Michael",
      lastName: "Davis",
      email: "michael@example.com",
      role: "employee",
      position: "Senior Technician",
      profileImageUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100"
    });

    this.users.set(4, {
      id: 4,
      username: "jennifer",
      password: "jennifer123",
      firstName: "Jennifer",
      lastName: "Lee",
      email: "jennifer@example.com",
      role: "employee",
      position: "Field Technician",
      profileImageUrl: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100"
    });

    this.users.set(5, {
      id: 5,
      username: "robert",
      password: "robert123",
      firstName: "Robert",
      lastName: "Wilson",
      email: "robert@example.com",
      role: "employee",
      position: "Field Technician",
      profileImageUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100"
    });

    this.users.set(6, {
      id: 6,
      username: "emma",
      password: "emma123",
      firstName: "Emma",
      lastName: "Thompson",
      email: "emma@example.com",
      role: "employee",
      position: "Administrative Assistant",
      profileImageUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100"
    });

    this.currentUserId = 7;

    // Add sample attendance records
    const today = new Date().toISOString().split('T')[0];
    
    this.attendance.set(1, {
      id: 1,
      userId: 2,
      checkInTime: new Date(),
      checkOutTime: null, // Add this
      status: "active",
      date: "2024-01-01"
    });

    this.attendance.set(2, {
      id: 2,
      userId: 3,
      checkInTime: new Date("2023-06-10T08:30:00"),
      checkOutTime: null, // Add this
      status: "active",
      date: "2024-01-01"
    });

    this.attendance.set(3, {
      id: 3,
      userId: 4,
      checkInTime: new Date("2023-06-10T09:05:00"),
      checkOutTime: null, // Add this
      status: "active",
      date: "2024-01-01"
    });

    this.attendance.set(4, {
      id: 4,
      userId: 5,
      checkInTime: new Date("2023-06-10T08:55:00"),
      checkOutTime: null, // Add this
      status: "active",
      date: "2024-01-01"
    });

    this.currentAttendanceId = 5;

    // Add sample tasks
    this.tasks.set(1, {
      id: 1,
      title: "Repair HVAC system at client site",
      description: "HVAC system at the Johnson Building has inconsistent cooling. Client reported too hot on 3rd floor, too cold in lobby. Need to check calibration and balance system.",
      assignedTo: 3,
      createdBy: 1,
      dueDate: new Date("2023-06-10T17:00:00"),
      status: "in_progress",
      priority: "high",
      createdAt: new Date("2023-06-09T10:00:00"),
      updatedAt: new Date("2023-06-09T10:00:00")
    });

    this.tasks.set(2, {
      id: 2,
      title: "Inspect electrical panel at Westview Apartments",
      description: "Regular inspection of electrical systems at Westview Apartments.",
      assignedTo: 4,
      createdBy: 1,
      dueDate: new Date("2023-06-11T14:00:00"),
      status: "in_progress",
      priority: "medium",
      createdAt: new Date("2023-06-09T11:30:00"),
      updatedAt: new Date("2023-06-09T11:30:00")
    });

    this.tasks.set(3, {
      id: 3,
      title: "Quarterly maintenance for office building",
      description: "Perform quarterly maintenance checks for all systems at the Riverside Office Complex.",
      assignedTo: 5,
      createdBy: 1,
      dueDate: new Date("2023-06-13T17:00:00"),
      status: "not_started",
      priority: "medium",
      createdAt: new Date("2023-06-09T13:45:00"),
      updatedAt: new Date("2023-06-09T13:45:00")
    });

    this.currentTaskId = 4;

    // Add sample photos
    this.photos.set(1, {
      id: 1,
      taskId: 1,
      userId: 3,
      imageUrl: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100",
      caption: "HVAC unit inspection",
      createdAt: new Date("2023-06-10T10:15:00")
    });

    this.photos.set(2, {
      id: 2,
      taskId: 1,
      userId: 3,
      imageUrl: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100",
      caption: "Working on HVAC controls",
      createdAt: new Date("2023-06-10T10:30:00")
    });

    this.currentPhotoId = 3;

    // Add sample activities
    this.activities.set(1, {
      id: 1,
      userId: 2,
      activityType: "task_report",
      description: "Sarah submitted a task report",
      entityId: 1,
      entityType: "task",
      createdAt: new Date(Date.now() - 10 * 60 * 1000) // 10 minutes ago
    });

    this.activities.set(2, {
      id: 2,
      userId: 3,
      activityType: "photo_upload",
      description: "Michael uploaded work photos",
      entityId: 1,
      entityType: "task",
      createdAt: new Date(Date.now() - 25 * 60 * 1000) // 25 minutes ago
    });

    this.activities.set(3, {
      id: 3,
      userId: 4,
      activityType: "note_added",
      description: "Jennifer added a note to Task #1234",
      entityId: 1,
      entityType: "task",
      createdAt: new Date(Date.now() - 45 * 60 * 1000) // 45 minutes ago
    });

    this.activities.set(4, {
      id: 4,
      userId: 5,
      activityType: "task_completed",
      description: "Robert completed Task #1235",
      entityId: 2,
      entityType: "task",
      createdAt: new Date(Date.now() - 60 * 60 * 1000) // 1 hour ago
    });

    this.activities.set(5, {
      id: 5,
      userId: 1,
      activityType: "task_assigned",
      description: "You assigned a new task to Michael",
      entityId: 3,
      entityType: "task",
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
    });

    this.currentActivityId = 6;
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    if (typeof id !== "number") return undefined;
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(userData: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = {
      ...userData,
      id,
      email: userData.email ?? null,
      role: userData.role ?? "user",
      position: userData.position ?? null,
      profileImageUrl: userData.profileImageUrl ?? null
    };
    this.users.set(id, user);
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    if (typeof id !== "number") return undefined;
    const user = this.users.get(id);
    if (!user) return undefined;
    const updatedUser = { ...user, ...userData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async deleteUser(id: number): Promise<boolean> {
    if (typeof id !== "number") return false;
    return this.users.delete(id);
  }

  // Attendance operations
  async getAttendance(id: number): Promise<Attendance | undefined> {
    if (typeof id !== "number") return undefined;
    return this.attendance.get(id);
  }

  async getAttendanceByUserAndDate(userId: number, date: string): Promise<Attendance | undefined> {
    if (typeof userId !== "number" || !date) return undefined;
    return Array.from(this.attendance.values()).find(
      a => a.userId === userId && a.date === date
    );
  }

  async createAttendance(attendanceData: InsertAttendance): Promise<Attendance> {
    const id = this.currentAttendanceId++;
    const attendance: Attendance = {
      ...attendanceData,
      id,
      status: attendanceData.status ?? "active",
      checkInTime: attendanceData.checkInTime ?? new Date(),
      checkOutTime: attendanceData.checkOutTime ?? null
    };
    this.attendance.set(id, attendance);
    return attendance;
  }

  async updateAttendance(id: number, attendanceData: Partial<Attendance>): Promise<Attendance | undefined> {
    const attendance = this.attendance.get(id);
    if (!attendance) return undefined;

    const updatedAttendance = { ...attendance, ...attendanceData };
    this.attendance.set(id, updatedAttendance);
    return updatedAttendance;
  }

  async getTodaysAttendance(date: string): Promise<Attendance[]> {
    return Array.from(this.attendance.values()).filter(a => a.date === date);
  }

  // Task operations
  async getTask(id: number): Promise<Task | undefined> {
    return this.tasks.get(id);
  }

  async createTask(taskData: InsertTask): Promise<Task> {
    const id = this.currentTaskId++;
    const now = new Date();
    const task: Task = {
      id,
      title: taskData.title,
      description: taskData.description ?? null,
      assignedTo: taskData.assignedTo ?? null,
      createdBy: taskData.createdBy,
      dueDate: taskData.dueDate ?? null,
      status: taskData.status ?? "active",
      priority: taskData.priority ?? "normal",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.tasks.set(id, task);
    return task;
  }

  async updateTask(id: number, taskData: Partial<Task>): Promise<Task | undefined> {
    const task = this.tasks.get(id);
    if (!task) return undefined;

    const updatedTask = {
      ...task,
      ...taskData,
      updatedAt: new Date()
    };
    this.tasks.set(id, updatedTask);
    return updatedTask;
  }

  async deleteTask(id: number): Promise<boolean> {
    return this.tasks.delete(id);
  }

  async getTasksByUser(userId: number): Promise<Task[]> {
    return Array.from(this.tasks.values())
      .filter(task => task.assignedTo === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getAllTasks(): Promise<Task[]> {
    return Array.from(this.tasks.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getRecentTasks(limit: number): Promise<Task[]> {
    return Array.from(this.tasks.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  }

  // Note operations
  async getNotesByTask(taskId: number): Promise<Note[]> {
    return Array.from(this.notes.values())
      .filter(note => note.taskId === taskId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createNote(noteData: InsertNote): Promise<Note> {
    const id = this.currentNoteId++;
    const note: Note = { 
      ...noteData, 
      id, 
      createdAt: new Date() 
    };
    this.notes.set(id, note);
    return note;
  }

  // Photo operations
  async getPhotosByTask(taskId: number): Promise<Photo[]> {
    return Array.from(this.photos.values())
      .filter(photo => photo.taskId === taskId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createPhoto(photoData: InsertPhoto): Promise<Photo> {
    const id = this.currentPhotoId++;
    const photo: Photo = { 
      ...photoData, 
      id, 
      caption: photoData.caption ?? null,
      createdAt: new Date()
    };
    this.photos.set(id, photo);
    return photo;
  }

  // Activity operations
  async getRecentActivities(limit: number): Promise<Activity[]> {
    return Array.from(this.activities.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  }

  async createActivity(activityData: InsertActivity): Promise<Activity> {
    const id = this.currentActivityId++;
    const activity: Activity = { 
      ...activityData, 
      id,
      entityId: activityData.entityId ?? null,
      entityType: activityData.entityType ?? null,
      createdAt: new Date()
    };
    this.activities.set(id, activity);
    return activity;
  }
}

export const storage = new MemStorage();

server: {
  // allowedHosts: true, // or remove this line if not needed
  // ...
}
