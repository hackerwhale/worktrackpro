import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage.js";
import { insertUserSchema, insertTaskSchema, insertNoteSchema, insertPhotoSchema, insertAttendanceSchema, insertActivitySchema } from "../shared/schema.js";
import multer from "multer";
import path from "path";
import fs from "fs";
import { randomUUID } from "crypto";
import session from "express-session";

// Setup multer for file uploads
const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      const uploadDir = path.join(process.cwd(), "uploads");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
      const fileExtension = path.extname(file.originalname);
      const fileName = `${randomUUID()}${fileExtension}`;
      cb(null, fileName);
    }
  }),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB file size limit
  },
  fileFilter: function (req, file, cb) {
    // Accept only images
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Middleware to check if user is authenticated
const isAuthenticated = (req: Request, res: Response, next: Function) => {
  if (req.session && req.session.userId) {
    next();
  } else {
    res.status(401).json({ message: "Not authenticated" });
  }
};

// Middleware to check if user is admin
const isAdmin = async (req: Request, res: Response, next: Function) => {
  if (req.session && req.session.userId) {
    const user = await storage.getUser(req.session.userId);
    if (user && user.role === 'admin') {
      next();
    } else {
      res.status(403).json({ message: "Not authorized" });
    }
  } else {
    res.status(401).json({ message: "Not authenticated" });
  }
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up session middleware with a proper configuration
  app.use(session({
    secret: 'your-session-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production', // only use secure in production
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  }));

  // Auth routes
  app.post('/api/auth/login', async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await storage.getUserByUsername(username);

      // Allow demo login
      if (
        username === process.env.DEMO_USER &&
        password === process.env.DEMO_PASSWORD
      ) {
        req.session.userId = 0; // or any demo user id
        return res.json({ message: "Login successful" });
      }

      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      if (req.session) {
        req.session.userId = user.id;
        req.session.role = user.role;
      }

      // Don't send password in response
      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "An error occurred during login" });
    }
  });

  app.post('/api/auth/logout', (req, res) => {
    if (req.session) {
      req.session.destroy((err) => {
        if (err) {
          return res.status(500).json({ message: "Could not log out" });
        }
        res.json({ message: "Logged out successfully" });
      });
    } else {
      res.json({ message: "Not logged in" });
    }
  });

  app.get('/api/auth/current-user', async (req, res) => {
    if (req.session && req.session.userId) {
      try {
        const user = await storage.getUser(req.session.userId);
        if (user) {
          // Don't send password in response
          const { password: _, ...userWithoutPassword } = user;
          return res.json(userWithoutPassword);
        }
      } catch (error) {
        console.error("Error fetching current user:", error);
      }
    }
    res.status(401).json({ message: "Not authenticated" });
  });

  // User routes
  app.get('/api/users', isAdmin, async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      // Remove passwords from response
      const usersWithoutPasswords = users.map(user => {
        const { password: _, ...userWithoutPassword } = user;
        return userWithoutPassword;
      });
      res.json(usersWithoutPasswords);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  app.get('/api/users/:id', isAuthenticated, async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Only admin or the user themselves can view user details
      if (req.session.role !== 'admin' && req.session.userId !== userId) {
        return res.status(403).json({ message: "Not authorized" });
      }

      // Don't send password in response
      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  app.post('/api/users', isAdmin, async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const newUser = await storage.createUser(userData);
      
      // Don't send password in response
      const { password: _, ...userWithoutPassword } = newUser;
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(400).json({ message: "Invalid user data" });
    }
  });

  app.put('/api/users/:id', isAuthenticated, async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      
      // Only admin or the user themselves can update user details
      if (req.session.role !== 'admin' && req.session.userId !== userId) {
        return res.status(403).json({ message: "Not authorized" });
      }

      const userData = req.body;
      const updatedUser = await storage.updateUser(userId, userData);
      
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      // Don't send password in response
      const { password: _, ...userWithoutPassword } = updatedUser;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(400).json({ message: "Invalid user data" });
    }
  });

  app.delete('/api/users/:id', isAdmin, async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const result = await storage.deleteUser(userId);
      
      if (!result) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({ message: "User deleted successfully" });
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ message: "Failed to delete user" });
    }
  });

  // Attendance routes
  app.get('/api/attendance', isAuthenticated, async (req, res) => {
    try {
      const date = req.query.date as string || new Date().toISOString().split('T')[0];
      const attendance = await storage.getTodaysAttendance(date);
      res.json(attendance);
    } catch (error) {
      console.error("Error fetching attendance:", error);
      res.status(500).json({ message: "Failed to fetch attendance" });
    }
  });

  // Attendance check-in
  app.post('/api/attendance/check-in', isAuthenticated, async (req, res) => {
    try {
      const userId = req.session.userId;
      if (typeof userId !== "number") {
        return res.status(401).json({ message: "Not authenticated" });
      }
      const date = new Date().toISOString().split('T')[0];

      // Check if user already checked in today
      const existingAttendance = await storage.getAttendanceByUserAndDate(userId, date);
      
      if (existingAttendance) {
        return res.status(400).json({ message: "Already checked in today" });
      }

      const attendanceData = insertAttendanceSchema.parse({
        userId,
        checkInTime: new Date(),
        date,
        status: "active"
      });

      const newAttendance = await storage.createAttendance(attendanceData);
      
      // Create activity for check-in
      await storage.createActivity({
        userId,
        activityType: "check_in",
        description: `User checked in at ${new Date().toLocaleTimeString()}`,
        entityId: newAttendance.id,
        entityType: "attendance"
      });

      res.status(201).json(newAttendance);
    } catch (error) {
      console.error("Error checking in:", error);
      res.status(400).json({ message: "Invalid attendance data" });
    }
  });

  // Attendance check-out
  app.post('/api/attendance/check-out', isAuthenticated, async (req, res) => {
    try {
      const userId = req.session.userId;
      if (typeof userId !== "number") {
        return res.status(401).json({ message: "Not authenticated" });
      }
      const date = new Date().toISOString().split('T')[0];

      // Find today's attendance record
      const existingAttendance = await storage.getAttendanceByUserAndDate(userId, date);
      
      if (!existingAttendance) {
        return res.status(404).json({ message: "No check-in record found for today" });
      }

      if (existingAttendance.checkOutTime) {
        return res.status(400).json({ message: "Already checked out today" });
      }

      const updatedAttendance = await storage.updateAttendance(existingAttendance.id, {
        checkOutTime: new Date(),
        status: "offline"
      });

      // Create activity for check-out
      await storage.createActivity({
        userId,
        activityType: "check_out",
        description: `User checked out at ${new Date().toLocaleTimeString()}`,
        entityId: existingAttendance.id,
        entityType: "attendance"
      });

      res.json(updatedAttendance);
    } catch (error) {
      console.error("Error checking out:", error);
      res.status(500).json({ message: "Failed to check out" });
    }
  });

  // Attendance status
  app.put('/api/attendance/status', isAuthenticated, async (req, res) => {
    try {
      const userId = req.session.userId;
      if (typeof userId !== "number") {
        return res.status(401).json({ message: "Not authenticated" });
      }
      const { status } = req.body;
      const date = new Date().toISOString().split('T')[0];
      
      // Find today's attendance record
      const existingAttendance = await storage.getAttendanceByUserAndDate(userId, date);
      
      if (!existingAttendance) {
        return res.status(404).json({ message: "No check-in record found for today" });
      }

      const updatedAttendance = await storage.updateAttendance(existingAttendance.id, {
        status
      });

      // Create activity for status change
      await storage.createActivity({
        userId,
        activityType: "status_change",
        description: `User changed status to ${status}`,
        entityId: existingAttendance.id,
        entityType: "attendance"
      });

      res.json(updatedAttendance);
    } catch (error) {
      console.error("Error updating status:", error);
      res.status(500).json({ message: "Failed to update status" });
    }
  });

  // Task routes
  app.get('/api/tasks', isAuthenticated, async (req, res) => {
    try {
      const tasks = await storage.getAllTasks();
      res.json(tasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      res.status(500).json({ message: "Failed to fetch tasks" });
    }
  });

  app.get('/api/tasks/recent', isAuthenticated, async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 3;
      const tasks = await storage.getRecentTasks(limit);
      res.json(tasks);
    } catch (error) {
      console.error("Error fetching recent tasks:", error);
      res.status(500).json({ message: "Failed to fetch recent tasks" });
    }
  });

  app.get('/api/tasks/user/:userId', isAuthenticated, async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      
      // Only admin or the user themselves can view their tasks
      if (req.session.role !== 'admin' && req.session.userId !== userId) {
        return res.status(403).json({ message: "Not authorized" });
      }

      const tasks = await storage.getTasksByUser(userId);
      res.json(tasks);
    } catch (error) {
      console.error("Error fetching user tasks:", error);
      res.status(500).json({ message: "Failed to fetch user tasks" });
    }
  });

  app.get('/api/tasks/:id', isAuthenticated, async (req, res) => {
    try {
      const taskId = parseInt(req.params.id);
      const task = await storage.getTask(taskId);
      
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }

      res.json(task);
    } catch (error) {
      console.error("Error fetching task:", error);
      res.status(500).json({ message: "Failed to fetch task" });
    }
  });

  // Create task
  app.post('/api/tasks', isAuthenticated, async (req, res) => {
    try {
      const userId = req.session.userId;
      if (typeof userId !== "number") {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      // Set the current user as the creator
      const taskData = insertTaskSchema.parse({
        ...req.body,
        createdBy: userId
      });

      const newTask = await storage.createTask(taskData);
      
      // Create activity for task creation
      await storage.createActivity({
        userId,
        activityType: "task_created",
        description: `User created task: ${newTask.title}`,
        entityId: newTask.id,
        entityType: "task"
      });

      res.status(201).json(newTask);
    } catch (error) {
      console.error("Error creating task:", error);
      res.status(400).json({ message: "Invalid task data" });
    }
  });

  // Update task
  app.put('/api/tasks/:id', isAuthenticated, async (req, res) => {
    try {
      const taskId = parseInt(req.params.id);
      const task = await storage.getTask(taskId);
      
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }

      // Only admin, creator, or assignee can update the task
      if (req.session.role !== 'admin' && 
          req.session.userId !== task.createdBy && 
          req.session.userId !== task.assignedTo) {
        return res.status(403).json({ message: "Not authorized" });
      }

      const updatedTask = await storage.updateTask(taskId, req.body);
      
      // Create activity for task update
      if (typeof req.session.userId !== "number") {
        return res.status(401).json({ message: "Not authenticated" });
      }
      await storage.createActivity({
        userId: req.session.userId,
        activityType: "task_updated",
        description: `User updated task: ${updatedTask?.title}`,
        entityId: taskId,
        entityType: "task"
      });

      res.json(updatedTask);
    } catch (error) {
      console.error("Error updating task:", error);
      res.status(400).json({ message: "Invalid task data" });
    }
  });

  // Delete task
  app.delete('/api/tasks/:id', isAuthenticated, async (req, res) => {
    try {
      const taskId = parseInt(req.params.id);
      const task = await storage.getTask(taskId);
      
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }

      // Only admin or creator can delete the task
      if (req.session.role !== 'admin' && req.session.userId !== task.createdBy) {
        return res.status(403).json({ message: "Not authorized" });
      }

      const result = await storage.deleteTask(taskId);
      
      if (result) {
        // Create activity for task deletion
        if (typeof req.session.userId !== "number") {
          return res.status(401).json({ message: "Not authenticated" });
        }
        await storage.createActivity({
          userId: req.session.userId,
          activityType: "task_deleted",
          description: `User deleted task: ${task.title}`,
          entityId: taskId,
          entityType: "task"
        });

        res.json({ message: "Task deleted successfully" });
      } else {
        res.status(500).json({ message: "Failed to delete task" });
      }
    } catch (error) {
      console.error("Error deleting task:", error);
      res.status(500).json({ message: "Failed to delete task" });
    }
  });

  // Note routes
  app.get('/api/tasks/:taskId/notes', isAuthenticated, async (req, res) => {
    try {
      const taskId = parseInt(req.params.taskId);
      const task = await storage.getTask(taskId);
      
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }

      const notes = await storage.getNotesByTask(taskId);
      res.json(notes);
    } catch (error) {
      console.error("Error fetching notes:", error);
      res.status(500).json({ message: "Failed to fetch notes" });
    }
  });

  app.post('/api/tasks/:taskId/notes', isAuthenticated, async (req, res) => {
    try {
      const taskId = parseInt(req.params.taskId);
      const userId = req.session.userId;
      
      const task = await storage.getTask(taskId);
      
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }

      if (typeof userId !== "number") {
        return res.status(401).json({ message: "Not authenticated" });
      }
      const noteData = insertNoteSchema.parse({
        taskId,
        userId,
        content: req.body.content
      });

      const newNote = await storage.createNote(noteData);
      
      // Create activity for note creation
      await storage.createActivity({
        userId,
        activityType: "note_added",
        description: `User added a note to task: ${task.title}`,
        entityId: newNote.id,
        entityType: "note"
      });

      res.status(201).json(newNote);
    } catch (error) {
      console.error("Error creating note:", error);
      res.status(400).json({ message: "Invalid note data" });
    }
  });

  // Photo routes
  app.get('/api/tasks/:taskId/photos', isAuthenticated, async (req, res) => {
    try {
      const taskId = parseInt(req.params.taskId);
      const task = await storage.getTask(taskId);
      
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }

      const photos = await storage.getPhotosByTask(taskId);
      res.json(photos);
    } catch (error) {
      console.error("Error fetching photos:", error);
      res.status(500).json({ message: "Failed to fetch photos" });
    }
  });

  app.post('/api/tasks/:taskId/photos', isAuthenticated, upload.single('photo'), async (req, res) => {
    try {
      const taskId = parseInt(req.params.taskId);
      const userId = req.session.userId;
      if (typeof userId !== "number") {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const task = await storage.getTask(taskId);
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }

      if (!req.file) {
        return res.status(400).json({ message: "No photo uploaded" });
      }

      const imageUrl = `/uploads/${req.file.filename}`;

      const photoData = insertPhotoSchema.parse({
        taskId,
        userId,
        imageUrl,
        caption: req.body.caption || "",
        createdAt: new Date()
      });

      const newPhoto = await storage.createPhoto(photoData);

      // Create activity for photo upload
      await storage.createActivity({
        userId,
        activityType: "photo_uploaded",
        description: `User uploaded a photo to task: ${task.title}`,
        entityId: newPhoto.id,
        entityType: "photo"
      });

      res.status(201).json(newPhoto);
    } catch (error) {
      console.error("Error uploading photo:", error);
      res.status(400).json({ message: "Invalid photo data" });
    }
  });

  // Activity routes
  app.get('/api/activities/recent', isAuthenticated, async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 5;
      const activities = await storage.getRecentActivities(limit);
      res.json(activities);
    } catch (error) {
      console.error("Error fetching activities:", error);
      res.status(500).json({ message: "Failed to fetch activities" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
