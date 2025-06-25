var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { eq, and, desc } from "drizzle-orm";
import { db } from "./db.js";
import { users, attendance, tasks, notes, photos, activities } from "../shared/schema.js";
var DatabaseStorage = /** @class */ (function () {
    function DatabaseStorage() {
    }
    // User operations
    DatabaseStorage.prototype.getUser = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (typeof id !== "number")
                            return [2 /*return*/, undefined];
                        return [4 /*yield*/, db.select().from(users).where(eq(users.id, id))];
                    case 1:
                        user = (_a.sent())[0];
                        return [2 /*return*/, user];
                }
            });
        });
    };
    DatabaseStorage.prototype.getUserByUsername = function (username) {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db.select().from(users).where(eq(users.username, username))];
                    case 1:
                        user = (_a.sent())[0];
                        return [2 /*return*/, user];
                }
            });
        });
    };
    DatabaseStorage.prototype.createUser = function (userData) {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db.insert(users).values(userData).returning()];
                    case 1:
                        user = (_a.sent())[0];
                        return [2 /*return*/, user];
                }
            });
        });
    };
    DatabaseStorage.prototype.getAllUsers = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db.select().from(users)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    DatabaseStorage.prototype.updateUser = function (id, userData) {
        return __awaiter(this, void 0, void 0, function () {
            var updatedUser;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (typeof id !== "number")
                            return [2 /*return*/, undefined];
                        return [4 /*yield*/, db
                                .update(users)
                                .set(userData)
                                .where(eq(users.id, id))
                                .returning()];
                    case 1:
                        updatedUser = (_a.sent())[0];
                        return [2 /*return*/, updatedUser];
                }
            });
        });
    };
    DatabaseStorage.prototype.deleteUser = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var deletedUser;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (typeof id !== "number")
                            return [2 /*return*/, false];
                        return [4 /*yield*/, db
                                .delete(users)
                                .where(eq(users.id, id))
                                .returning()];
                    case 1:
                        deletedUser = (_a.sent())[0];
                        return [2 /*return*/, !!deletedUser];
                }
            });
        });
    };
    // Attendance operations
    DatabaseStorage.prototype.getAttendance = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var attendanceRecord;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (typeof id !== "number")
                            return [2 /*return*/, undefined];
                        return [4 /*yield*/, db
                                .select()
                                .from(attendance)
                                .where(eq(attendance.id, id))];
                    case 1:
                        attendanceRecord = (_a.sent())[0];
                        return [2 /*return*/, attendanceRecord];
                }
            });
        });
    };
    DatabaseStorage.prototype.getAttendanceByUserAndDate = function (userId, date) {
        return __awaiter(this, void 0, void 0, function () {
            var attendanceRecord;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (typeof userId !== "number" || !date)
                            return [2 /*return*/, undefined];
                        return [4 /*yield*/, db
                                .select()
                                .from(attendance)
                                .where(and(eq(attendance.userId, userId), eq(attendance.date, date)))];
                    case 1:
                        attendanceRecord = (_a.sent())[0];
                        return [2 /*return*/, attendanceRecord];
                }
            });
        });
    };
    DatabaseStorage.prototype.createAttendance = function (attendanceData) {
        return __awaiter(this, void 0, void 0, function () {
            var newAttendance;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db
                            .insert(attendance)
                            .values(attendanceData)
                            .returning()];
                    case 1:
                        newAttendance = (_a.sent())[0];
                        return [2 /*return*/, newAttendance];
                }
            });
        });
    };
    DatabaseStorage.prototype.updateAttendance = function (id, attendanceData) {
        return __awaiter(this, void 0, void 0, function () {
            var updatedAttendance;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db
                            .update(attendance)
                            .set(attendanceData)
                            .where(eq(attendance.id, id))
                            .returning()];
                    case 1:
                        updatedAttendance = (_a.sent())[0];
                        return [2 /*return*/, updatedAttendance];
                }
            });
        });
    };
    DatabaseStorage.prototype.getTodaysAttendance = function (date) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db
                            .select()
                            .from(attendance)
                            .where(eq(attendance.date, date))];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    // Task operations
    DatabaseStorage.prototype.getTask = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var task;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db
                            .select()
                            .from(tasks)
                            .where(eq(tasks.id, id))];
                    case 1:
                        task = (_a.sent())[0];
                        return [2 /*return*/, task];
                }
            });
        });
    };
    DatabaseStorage.prototype.createTask = function (taskData) {
        return __awaiter(this, void 0, void 0, function () {
            var newTask;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db
                            .insert(tasks)
                            .values(taskData)
                            .returning()];
                    case 1:
                        newTask = (_a.sent())[0];
                        return [2 /*return*/, newTask];
                }
            });
        });
    };
    DatabaseStorage.prototype.updateTask = function (id, taskData) {
        return __awaiter(this, void 0, void 0, function () {
            var updatedTask;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db
                            .update(tasks)
                            .set(taskData)
                            .where(eq(tasks.id, id))
                            .returning()];
                    case 1:
                        updatedTask = (_a.sent())[0];
                        return [2 /*return*/, updatedTask];
                }
            });
        });
    };
    DatabaseStorage.prototype.deleteTask = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var deletedTask;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db
                            .delete(tasks)
                            .where(eq(tasks.id, id))
                            .returning()];
                    case 1:
                        deletedTask = (_a.sent())[0];
                        return [2 /*return*/, !!deletedTask];
                }
            });
        });
    };
    DatabaseStorage.prototype.getTasksByUser = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db
                            .select()
                            .from(tasks)
                            .where(eq(tasks.assignedTo, userId))
                            .orderBy(desc(tasks.createdAt))];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    DatabaseStorage.prototype.getAllTasks = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db
                            .select()
                            .from(tasks)
                            .orderBy(desc(tasks.createdAt))];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    DatabaseStorage.prototype.getRecentTasks = function (limit) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db
                            .select()
                            .from(tasks)
                            .orderBy(desc(tasks.createdAt))
                            .limit(limit)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    // Note operations
    DatabaseStorage.prototype.getNotesByTask = function (taskId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db
                            .select()
                            .from(notes)
                            .where(eq(notes.taskId, taskId))
                            .orderBy(desc(notes.createdAt))];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    DatabaseStorage.prototype.createNote = function (noteData) {
        return __awaiter(this, void 0, void 0, function () {
            var newNote;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db
                            .insert(notes)
                            .values(noteData)
                            .returning()];
                    case 1:
                        newNote = (_a.sent())[0];
                        return [2 /*return*/, newNote];
                }
            });
        });
    };
    // Photo operations
    DatabaseStorage.prototype.getPhotosByTask = function (taskId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db
                            .select()
                            .from(photos)
                            .where(eq(photos.taskId, taskId))
                            .orderBy(desc(photos.createdAt))];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    DatabaseStorage.prototype.createPhoto = function (photoData) {
        return __awaiter(this, void 0, void 0, function () {
            var newPhoto;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db
                            .insert(photos)
                            .values(photoData)
                            .returning()];
                    case 1:
                        newPhoto = (_a.sent())[0];
                        return [2 /*return*/, newPhoto];
                }
            });
        });
    };
    // Activity operations
    DatabaseStorage.prototype.getRecentActivities = function (limit) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db
                            .select()
                            .from(activities)
                            .orderBy(desc(activities.createdAt))
                            .limit(limit)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    DatabaseStorage.prototype.createActivity = function (activityData) {
        return __awaiter(this, void 0, void 0, function () {
            var newActivity;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db
                            .insert(activities)
                            .values(activityData)
                            .returning()];
                    case 1:
                        newActivity = (_a.sent())[0];
                        return [2 /*return*/, newActivity];
                }
            });
        });
    };
    return DatabaseStorage;
}());
export { DatabaseStorage };
// For simplicity, let's use MemStorage for development
var MemStorage = /** @class */ (function () {
    function MemStorage() {
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
        var today = new Date().toISOString().split('T')[0];
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
    MemStorage.prototype.getUser = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (typeof id !== "number")
                    return [2 /*return*/, undefined];
                return [2 /*return*/, this.users.get(id)];
            });
        });
    };
    MemStorage.prototype.getUserByUsername = function (username) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, Array.from(this.users.values()).find(function (user) { return user.username === username; })];
            });
        });
    };
    MemStorage.prototype.createUser = function (userData) {
        return __awaiter(this, void 0, void 0, function () {
            var id, user;
            var _a, _b, _c, _d;
            return __generator(this, function (_e) {
                id = this.currentUserId++;
                user = __assign(__assign({}, userData), { id: id, email: (_a = userData.email) !== null && _a !== void 0 ? _a : null, role: (_b = userData.role) !== null && _b !== void 0 ? _b : "user", position: (_c = userData.position) !== null && _c !== void 0 ? _c : null, profileImageUrl: (_d = userData.profileImageUrl) !== null && _d !== void 0 ? _d : null });
                this.users.set(id, user);
                return [2 /*return*/, user];
            });
        });
    };
    MemStorage.prototype.getAllUsers = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, Array.from(this.users.values())];
            });
        });
    };
    MemStorage.prototype.updateUser = function (id, userData) {
        return __awaiter(this, void 0, void 0, function () {
            var user, updatedUser;
            return __generator(this, function (_a) {
                if (typeof id !== "number")
                    return [2 /*return*/, undefined];
                user = this.users.get(id);
                if (!user)
                    return [2 /*return*/, undefined];
                updatedUser = __assign(__assign({}, user), userData);
                this.users.set(id, updatedUser);
                return [2 /*return*/, updatedUser];
            });
        });
    };
    MemStorage.prototype.deleteUser = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (typeof id !== "number")
                    return [2 /*return*/, false];
                return [2 /*return*/, this.users.delete(id)];
            });
        });
    };
    // Attendance operations
    MemStorage.prototype.getAttendance = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (typeof id !== "number")
                    return [2 /*return*/, undefined];
                return [2 /*return*/, this.attendance.get(id)];
            });
        });
    };
    MemStorage.prototype.getAttendanceByUserAndDate = function (userId, date) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (typeof userId !== "number" || !date)
                    return [2 /*return*/, undefined];
                return [2 /*return*/, Array.from(this.attendance.values()).find(function (a) { return a.userId === userId && a.date === date; })];
            });
        });
    };
    MemStorage.prototype.createAttendance = function (attendanceData) {
        return __awaiter(this, void 0, void 0, function () {
            var id, attendance;
            var _a, _b, _c;
            return __generator(this, function (_d) {
                id = this.currentAttendanceId++;
                attendance = __assign(__assign({}, attendanceData), { id: id, status: (_a = attendanceData.status) !== null && _a !== void 0 ? _a : "active", checkInTime: (_b = attendanceData.checkInTime) !== null && _b !== void 0 ? _b : new Date(), checkOutTime: (_c = attendanceData.checkOutTime) !== null && _c !== void 0 ? _c : null });
                this.attendance.set(id, attendance);
                return [2 /*return*/, attendance];
            });
        });
    };
    MemStorage.prototype.updateAttendance = function (id, attendanceData) {
        return __awaiter(this, void 0, void 0, function () {
            var attendance, updatedAttendance;
            return __generator(this, function (_a) {
                attendance = this.attendance.get(id);
                if (!attendance)
                    return [2 /*return*/, undefined];
                updatedAttendance = __assign(__assign({}, attendance), attendanceData);
                this.attendance.set(id, updatedAttendance);
                return [2 /*return*/, updatedAttendance];
            });
        });
    };
    MemStorage.prototype.getTodaysAttendance = function (date) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, Array.from(this.attendance.values()).filter(function (a) { return a.date === date; })];
            });
        });
    };
    // Task operations
    MemStorage.prototype.getTask = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.tasks.get(id)];
            });
        });
    };
    MemStorage.prototype.createTask = function (taskData) {
        return __awaiter(this, void 0, void 0, function () {
            var id, now, task;
            var _a, _b, _c, _d, _e;
            return __generator(this, function (_f) {
                id = this.currentTaskId++;
                now = new Date();
                task = {
                    id: id,
                    title: taskData.title,
                    description: (_a = taskData.description) !== null && _a !== void 0 ? _a : null,
                    assignedTo: (_b = taskData.assignedTo) !== null && _b !== void 0 ? _b : null,
                    createdBy: taskData.createdBy,
                    dueDate: (_c = taskData.dueDate) !== null && _c !== void 0 ? _c : null,
                    status: (_d = taskData.status) !== null && _d !== void 0 ? _d : "active",
                    priority: (_e = taskData.priority) !== null && _e !== void 0 ? _e : "normal",
                    createdAt: new Date(),
                    updatedAt: new Date()
                };
                this.tasks.set(id, task);
                return [2 /*return*/, task];
            });
        });
    };
    MemStorage.prototype.updateTask = function (id, taskData) {
        return __awaiter(this, void 0, void 0, function () {
            var task, updatedTask;
            return __generator(this, function (_a) {
                task = this.tasks.get(id);
                if (!task)
                    return [2 /*return*/, undefined];
                updatedTask = __assign(__assign(__assign({}, task), taskData), { updatedAt: new Date() });
                this.tasks.set(id, updatedTask);
                return [2 /*return*/, updatedTask];
            });
        });
    };
    MemStorage.prototype.deleteTask = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.tasks.delete(id)];
            });
        });
    };
    MemStorage.prototype.getTasksByUser = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, Array.from(this.tasks.values())
                        .filter(function (task) { return task.assignedTo === userId; })
                        .sort(function (a, b) { return b.createdAt.getTime() - a.createdAt.getTime(); })];
            });
        });
    };
    MemStorage.prototype.getAllTasks = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, Array.from(this.tasks.values())
                        .sort(function (a, b) { return b.createdAt.getTime() - a.createdAt.getTime(); })];
            });
        });
    };
    MemStorage.prototype.getRecentTasks = function (limit) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, Array.from(this.tasks.values())
                        .sort(function (a, b) { return b.createdAt.getTime() - a.createdAt.getTime(); })
                        .slice(0, limit)];
            });
        });
    };
    // Note operations
    MemStorage.prototype.getNotesByTask = function (taskId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, Array.from(this.notes.values())
                        .filter(function (note) { return note.taskId === taskId; })
                        .sort(function (a, b) { return b.createdAt.getTime() - a.createdAt.getTime(); })];
            });
        });
    };
    MemStorage.prototype.createNote = function (noteData) {
        return __awaiter(this, void 0, void 0, function () {
            var id, note;
            return __generator(this, function (_a) {
                id = this.currentNoteId++;
                note = __assign(__assign({}, noteData), { id: id, createdAt: new Date() });
                this.notes.set(id, note);
                return [2 /*return*/, note];
            });
        });
    };
    // Photo operations
    MemStorage.prototype.getPhotosByTask = function (taskId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, Array.from(this.photos.values())
                        .filter(function (photo) { return photo.taskId === taskId; })
                        .sort(function (a, b) { return b.createdAt.getTime() - a.createdAt.getTime(); })];
            });
        });
    };
    MemStorage.prototype.createPhoto = function (photoData) {
        return __awaiter(this, void 0, void 0, function () {
            var id, photo;
            var _a;
            return __generator(this, function (_b) {
                id = this.currentPhotoId++;
                photo = __assign(__assign({}, photoData), { id: id, caption: (_a = photoData.caption) !== null && _a !== void 0 ? _a : null, createdAt: new Date() });
                this.photos.set(id, photo);
                return [2 /*return*/, photo];
            });
        });
    };
    // Activity operations
    MemStorage.prototype.getRecentActivities = function (limit) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, Array.from(this.activities.values())
                        .sort(function (a, b) { return b.createdAt.getTime() - a.createdAt.getTime(); })
                        .slice(0, limit)];
            });
        });
    };
    MemStorage.prototype.createActivity = function (activityData) {
        return __awaiter(this, void 0, void 0, function () {
            var id, activity;
            var _a, _b;
            return __generator(this, function (_c) {
                id = this.currentActivityId++;
                activity = __assign(__assign({}, activityData), { id: id, entityId: (_a = activityData.entityId) !== null && _a !== void 0 ? _a : null, entityType: (_b = activityData.entityType) !== null && _b !== void 0 ? _b : null, createdAt: new Date() });
                this.activities.set(id, activity);
                return [2 /*return*/, activity];
            });
        });
    };
    return MemStorage;
}());
export { MemStorage };
export var storage = new MemStorage();
server: {
    // allowedHosts: true, // or remove this line if not needed
    // ...
}
