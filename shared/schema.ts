import {
  pgTable,
  text,
  serial,
  varchar,
  timestamp,
  boolean,
  integer,
  primaryKey,
  json,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User roles enum
export const UserRole = {
  ADMIN: 'admin',
  EMPLOYEE: 'employee',
} as const;

// User table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  firstName: varchar("first_name").notNull(),
  lastName: varchar("last_name").notNull(),
  email: varchar("email").unique(),
  role: text("role").notNull().default(UserRole.EMPLOYEE),
  position: varchar("position"),
  profileImageUrl: varchar("profile_image_url"),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Attendance table
export const attendance = pgTable("attendance", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  checkInTime: timestamp("check_in_time").defaultNow().notNull(),
  checkOutTime: timestamp("check_out_time"),
  date: varchar("date").notNull(), // Format: YYYY-MM-DD
  status: varchar("status").notNull().default("active"), // active, break, offline
});

export const insertAttendanceSchema = createInsertSchema(attendance).omit({
  id: true,
});

export type InsertAttendance = z.infer<typeof insertAttendanceSchema>;
export type Attendance = typeof attendance.$inferSelect;

// Tasks table
export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  title: varchar("title").notNull(),
  description: text("description"),
  assignedTo: integer("assigned_to").references(() => users.id),
  createdBy: integer("created_by").references(() => users.id).notNull(),
  dueDate: timestamp("due_date"),
  status: varchar("status").notNull().default("not_started"), // not_started, in_progress, completed, overdue
  priority: varchar("priority").notNull().default("medium"), // low, medium, high
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertTaskSchema = createInsertSchema(tasks).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertTask = z.infer<typeof insertTaskSchema>;
export type Task = typeof tasks.$inferSelect;

// Notes table
export const notes = pgTable("notes", {
  id: serial("id").primaryKey(),
  taskId: integer("task_id").references(() => tasks.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertNoteSchema = createInsertSchema(notes).omit({
  id: true,
  createdAt: true,
});

export type InsertNote = z.infer<typeof insertNoteSchema>;
export type Note = typeof notes.$inferSelect;

// Photos table
export const photos = pgTable("photos", {
  id: serial("id").primaryKey(),
  taskId: integer("task_id").references(() => tasks.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  imageUrl: varchar("image_url").notNull(),
  caption: varchar("caption"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertPhotoSchema = createInsertSchema(photos).omit({
  id: true,
  createdAt: true,
});

export type InsertPhoto = z.infer<typeof insertPhotoSchema>;
export type Photo = typeof photos.$inferSelect;

// Activity table for activity timeline
export const activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  activityType: varchar("activity_type").notNull(), // task_created, task_completed, note_added, photo_uploaded, etc.
  description: text("description").notNull(),
  entityId: integer("entity_id"), // ID of related entity (task, note, etc.)
  entityType: varchar("entity_type"), // Type of related entity (task, note, etc.)
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertActivitySchema = createInsertSchema(activities).omit({
  id: true,
  createdAt: true,
});

export type InsertActivity = z.infer<typeof insertActivitySchema>;
export type Activity = typeof activities.$inferSelect;
