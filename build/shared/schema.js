import { pgTable, text, serial, varchar, timestamp, integer, } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
// User roles enum
export var UserRole = {
    ADMIN: 'admin',
    EMPLOYEE: 'employee',
};
// User table
export var users = pgTable("users", {
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
export var insertUserSchema = createInsertSchema(users).omit({
    id: true,
});
// Attendance table
export var attendance = pgTable("attendance", {
    id: serial("id").primaryKey(),
    userId: integer("user_id").references(function () { return users.id; }).notNull(),
    checkInTime: timestamp("check_in_time").defaultNow().notNull(),
    checkOutTime: timestamp("check_out_time"),
    date: varchar("date").notNull(), // Format: YYYY-MM-DD
    status: varchar("status").notNull().default("active"), // active, break, offline
});
export var insertAttendanceSchema = createInsertSchema(attendance).omit({
    id: true,
});
// Tasks table
export var tasks = pgTable("tasks", {
    id: serial("id").primaryKey(),
    title: varchar("title").notNull(),
    description: text("description"),
    assignedTo: integer("assigned_to").references(function () { return users.id; }),
    createdBy: integer("created_by").references(function () { return users.id; }).notNull(),
    dueDate: timestamp("due_date"),
    status: varchar("status").notNull().default("not_started"), // not_started, in_progress, completed, overdue
    priority: varchar("priority").notNull().default("medium"), // low, medium, high
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
export var insertTaskSchema = createInsertSchema(tasks).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});
// Notes table
export var notes = pgTable("notes", {
    id: serial("id").primaryKey(),
    taskId: integer("task_id").references(function () { return tasks.id; }).notNull(),
    userId: integer("user_id").references(function () { return users.id; }).notNull(),
    content: text("content").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});
export var insertNoteSchema = createInsertSchema(notes).omit({
    id: true,
    createdAt: true,
});
// Photos table
export var photos = pgTable("photos", {
    id: serial("id").primaryKey(),
    taskId: integer("task_id").references(function () { return tasks.id; }).notNull(),
    userId: integer("user_id").references(function () { return users.id; }).notNull(),
    imageUrl: varchar("image_url").notNull(),
    caption: varchar("caption"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});
export var insertPhotoSchema = createInsertSchema(photos).omit({
    id: true,
    createdAt: true,
});
// Activity table for activity timeline
export var activities = pgTable("activities", {
    id: serial("id").primaryKey(),
    userId: integer("user_id").references(function () { return users.id; }).notNull(),
    activityType: varchar("activity_type").notNull(), // task_created, task_completed, note_added, photo_uploaded, etc.
    description: text("description").notNull(),
    entityId: integer("entity_id"), // ID of related entity (task, note, etc.)
    entityType: varchar("entity_type"), // Type of related entity (task, note, etc.)
    createdAt: timestamp("created_at").defaultNow().notNull(),
});
export var insertActivitySchema = createInsertSchema(activities).omit({
    id: true,
    createdAt: true,
});
