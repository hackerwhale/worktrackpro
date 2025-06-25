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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { createServer } from "http";
import { storage } from "./storage.js";
import { insertUserSchema, insertTaskSchema, insertNoteSchema, insertPhotoSchema, insertAttendanceSchema } from "../shared/schema.js";
import multer from "multer";
import path from "path";
import fs from "fs";
import { randomUUID } from "crypto";
import session from "express-session";
// Setup multer for file uploads
var upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            var uploadDir = path.join(process.cwd(), "uploads");
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }
            cb(null, uploadDir);
        },
        filename: function (req, file, cb) {
            var fileExtension = path.extname(file.originalname);
            var fileName = "".concat(randomUUID()).concat(fileExtension);
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
        }
        else {
            cb(new Error('Only image files are allowed'));
        }
    }
});
// Middleware to check if user is authenticated
var isAuthenticated = function (req, res, next) {
    if (req.session && req.session.userId) {
        next();
    }
    else {
        res.status(401).json({ message: "Not authenticated" });
    }
};
// Middleware to check if user is admin
var isAdmin = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var user;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!(req.session && req.session.userId)) return [3 /*break*/, 2];
                return [4 /*yield*/, storage.getUser(req.session.userId)];
            case 1:
                user = _a.sent();
                if (user && user.role === 'admin') {
                    next();
                }
                else {
                    res.status(403).json({ message: "Not authorized" });
                }
                return [3 /*break*/, 3];
            case 2:
                res.status(401).json({ message: "Not authenticated" });
                _a.label = 3;
            case 3: return [2 /*return*/];
        }
    });
}); };
export function registerRoutes(app) {
    return __awaiter(this, void 0, void 0, function () {
        var httpServer;
        var _this = this;
        return __generator(this, function (_a) {
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
            app.post('/api/auth/login', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var _a, username, password, user, _, userWithoutPassword, error_1;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 2, , 3]);
                            _a = req.body, username = _a.username, password = _a.password;
                            return [4 /*yield*/, storage.getUserByUsername(username)];
                        case 1:
                            user = _b.sent();
                            if (!user || user.password !== password) {
                                return [2 /*return*/, res.status(401).json({ message: "Invalid credentials" })];
                            }
                            if (req.session) {
                                req.session.userId = user.id;
                                req.session.role = user.role;
                            }
                            _ = user.password, userWithoutPassword = __rest(user, ["password"]);
                            res.json(userWithoutPassword);
                            return [3 /*break*/, 3];
                        case 2:
                            error_1 = _b.sent();
                            console.error("Login error:", error_1);
                            res.status(500).json({ message: "An error occurred during login" });
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            }); });
            app.post('/api/auth/logout', function (req, res) {
                if (req.session) {
                    req.session.destroy(function (err) {
                        if (err) {
                            return res.status(500).json({ message: "Could not log out" });
                        }
                        res.json({ message: "Logged out successfully" });
                    });
                }
                else {
                    res.json({ message: "Not logged in" });
                }
            });
            app.get('/api/auth/current-user', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var user, _, userWithoutPassword, error_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!(req.session && req.session.userId)) return [3 /*break*/, 4];
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, storage.getUser(req.session.userId)];
                        case 2:
                            user = _a.sent();
                            if (user) {
                                _ = user.password, userWithoutPassword = __rest(user, ["password"]);
                                return [2 /*return*/, res.json(userWithoutPassword)];
                            }
                            return [3 /*break*/, 4];
                        case 3:
                            error_2 = _a.sent();
                            console.error("Error fetching current user:", error_2);
                            return [3 /*break*/, 4];
                        case 4:
                            res.status(401).json({ message: "Not authenticated" });
                            return [2 /*return*/];
                    }
                });
            }); });
            // User routes
            app.get('/api/users', isAdmin, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var users, usersWithoutPasswords, error_3;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, storage.getAllUsers()];
                        case 1:
                            users = _a.sent();
                            usersWithoutPasswords = users.map(function (user) {
                                var _ = user.password, userWithoutPassword = __rest(user, ["password"]);
                                return userWithoutPassword;
                            });
                            res.json(usersWithoutPasswords);
                            return [3 /*break*/, 3];
                        case 2:
                            error_3 = _a.sent();
                            console.error("Error fetching users:", error_3);
                            res.status(500).json({ message: "Failed to fetch users" });
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            }); });
            app.get('/api/users/:id', isAuthenticated, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var userId, user, _, userWithoutPassword, error_4;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            userId = parseInt(req.params.id);
                            return [4 /*yield*/, storage.getUser(userId)];
                        case 1:
                            user = _a.sent();
                            if (!user) {
                                return [2 /*return*/, res.status(404).json({ message: "User not found" })];
                            }
                            // Only admin or the user themselves can view user details
                            if (req.session.role !== 'admin' && req.session.userId !== userId) {
                                return [2 /*return*/, res.status(403).json({ message: "Not authorized" })];
                            }
                            _ = user.password, userWithoutPassword = __rest(user, ["password"]);
                            res.json(userWithoutPassword);
                            return [3 /*break*/, 3];
                        case 2:
                            error_4 = _a.sent();
                            console.error("Error fetching user:", error_4);
                            res.status(500).json({ message: "Failed to fetch user" });
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            }); });
            app.post('/api/users', isAdmin, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var userData, newUser, _, userWithoutPassword, error_5;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            userData = insertUserSchema.parse(req.body);
                            return [4 /*yield*/, storage.createUser(userData)];
                        case 1:
                            newUser = _a.sent();
                            _ = newUser.password, userWithoutPassword = __rest(newUser, ["password"]);
                            res.status(201).json(userWithoutPassword);
                            return [3 /*break*/, 3];
                        case 2:
                            error_5 = _a.sent();
                            console.error("Error creating user:", error_5);
                            res.status(400).json({ message: "Invalid user data" });
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            }); });
            app.put('/api/users/:id', isAuthenticated, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var userId, userData, updatedUser, _, userWithoutPassword, error_6;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            userId = parseInt(req.params.id);
                            // Only admin or the user themselves can update user details
                            if (req.session.role !== 'admin' && req.session.userId !== userId) {
                                return [2 /*return*/, res.status(403).json({ message: "Not authorized" })];
                            }
                            userData = req.body;
                            return [4 /*yield*/, storage.updateUser(userId, userData)];
                        case 1:
                            updatedUser = _a.sent();
                            if (!updatedUser) {
                                return [2 /*return*/, res.status(404).json({ message: "User not found" })];
                            }
                            _ = updatedUser.password, userWithoutPassword = __rest(updatedUser, ["password"]);
                            res.json(userWithoutPassword);
                            return [3 /*break*/, 3];
                        case 2:
                            error_6 = _a.sent();
                            console.error("Error updating user:", error_6);
                            res.status(400).json({ message: "Invalid user data" });
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            }); });
            app.delete('/api/users/:id', isAdmin, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var userId, result, error_7;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            userId = parseInt(req.params.id);
                            return [4 /*yield*/, storage.deleteUser(userId)];
                        case 1:
                            result = _a.sent();
                            if (!result) {
                                return [2 /*return*/, res.status(404).json({ message: "User not found" })];
                            }
                            res.json({ message: "User deleted successfully" });
                            return [3 /*break*/, 3];
                        case 2:
                            error_7 = _a.sent();
                            console.error("Error deleting user:", error_7);
                            res.status(500).json({ message: "Failed to delete user" });
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            }); });
            // Attendance routes
            app.get('/api/attendance', isAuthenticated, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var date, attendance, error_8;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            date = req.query.date || new Date().toISOString().split('T')[0];
                            return [4 /*yield*/, storage.getTodaysAttendance(date)];
                        case 1:
                            attendance = _a.sent();
                            res.json(attendance);
                            return [3 /*break*/, 3];
                        case 2:
                            error_8 = _a.sent();
                            console.error("Error fetching attendance:", error_8);
                            res.status(500).json({ message: "Failed to fetch attendance" });
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            }); });
            // Attendance check-in
            app.post('/api/attendance/check-in', isAuthenticated, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var userId, date, existingAttendance, attendanceData, newAttendance, error_9;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 4, , 5]);
                            userId = req.session.userId;
                            if (typeof userId !== "number") {
                                return [2 /*return*/, res.status(401).json({ message: "Not authenticated" })];
                            }
                            date = new Date().toISOString().split('T')[0];
                            return [4 /*yield*/, storage.getAttendanceByUserAndDate(userId, date)];
                        case 1:
                            existingAttendance = _a.sent();
                            if (existingAttendance) {
                                return [2 /*return*/, res.status(400).json({ message: "Already checked in today" })];
                            }
                            attendanceData = insertAttendanceSchema.parse({
                                userId: userId,
                                checkInTime: new Date(),
                                date: date,
                                status: "active"
                            });
                            return [4 /*yield*/, storage.createAttendance(attendanceData)];
                        case 2:
                            newAttendance = _a.sent();
                            // Create activity for check-in
                            return [4 /*yield*/, storage.createActivity({
                                    userId: userId,
                                    activityType: "check_in",
                                    description: "User checked in at ".concat(new Date().toLocaleTimeString()),
                                    entityId: newAttendance.id,
                                    entityType: "attendance"
                                })];
                        case 3:
                            // Create activity for check-in
                            _a.sent();
                            res.status(201).json(newAttendance);
                            return [3 /*break*/, 5];
                        case 4:
                            error_9 = _a.sent();
                            console.error("Error checking in:", error_9);
                            res.status(400).json({ message: "Invalid attendance data" });
                            return [3 /*break*/, 5];
                        case 5: return [2 /*return*/];
                    }
                });
            }); });
            // Attendance check-out
            app.post('/api/attendance/check-out', isAuthenticated, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var userId, date, existingAttendance, updatedAttendance, error_10;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 4, , 5]);
                            userId = req.session.userId;
                            if (typeof userId !== "number") {
                                return [2 /*return*/, res.status(401).json({ message: "Not authenticated" })];
                            }
                            date = new Date().toISOString().split('T')[0];
                            return [4 /*yield*/, storage.getAttendanceByUserAndDate(userId, date)];
                        case 1:
                            existingAttendance = _a.sent();
                            if (!existingAttendance) {
                                return [2 /*return*/, res.status(404).json({ message: "No check-in record found for today" })];
                            }
                            if (existingAttendance.checkOutTime) {
                                return [2 /*return*/, res.status(400).json({ message: "Already checked out today" })];
                            }
                            return [4 /*yield*/, storage.updateAttendance(existingAttendance.id, {
                                    checkOutTime: new Date(),
                                    status: "offline"
                                })];
                        case 2:
                            updatedAttendance = _a.sent();
                            // Create activity for check-out
                            return [4 /*yield*/, storage.createActivity({
                                    userId: userId,
                                    activityType: "check_out",
                                    description: "User checked out at ".concat(new Date().toLocaleTimeString()),
                                    entityId: existingAttendance.id,
                                    entityType: "attendance"
                                })];
                        case 3:
                            // Create activity for check-out
                            _a.sent();
                            res.json(updatedAttendance);
                            return [3 /*break*/, 5];
                        case 4:
                            error_10 = _a.sent();
                            console.error("Error checking out:", error_10);
                            res.status(500).json({ message: "Failed to check out" });
                            return [3 /*break*/, 5];
                        case 5: return [2 /*return*/];
                    }
                });
            }); });
            // Attendance status
            app.put('/api/attendance/status', isAuthenticated, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var userId, status_1, date, existingAttendance, updatedAttendance, error_11;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 4, , 5]);
                            userId = req.session.userId;
                            if (typeof userId !== "number") {
                                return [2 /*return*/, res.status(401).json({ message: "Not authenticated" })];
                            }
                            status_1 = req.body.status;
                            date = new Date().toISOString().split('T')[0];
                            return [4 /*yield*/, storage.getAttendanceByUserAndDate(userId, date)];
                        case 1:
                            existingAttendance = _a.sent();
                            if (!existingAttendance) {
                                return [2 /*return*/, res.status(404).json({ message: "No check-in record found for today" })];
                            }
                            return [4 /*yield*/, storage.updateAttendance(existingAttendance.id, {
                                    status: status_1
                                })];
                        case 2:
                            updatedAttendance = _a.sent();
                            // Create activity for status change
                            return [4 /*yield*/, storage.createActivity({
                                    userId: userId,
                                    activityType: "status_change",
                                    description: "User changed status to ".concat(status_1),
                                    entityId: existingAttendance.id,
                                    entityType: "attendance"
                                })];
                        case 3:
                            // Create activity for status change
                            _a.sent();
                            res.json(updatedAttendance);
                            return [3 /*break*/, 5];
                        case 4:
                            error_11 = _a.sent();
                            console.error("Error updating status:", error_11);
                            res.status(500).json({ message: "Failed to update status" });
                            return [3 /*break*/, 5];
                        case 5: return [2 /*return*/];
                    }
                });
            }); });
            // Task routes
            app.get('/api/tasks', isAuthenticated, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var tasks, error_12;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, storage.getAllTasks()];
                        case 1:
                            tasks = _a.sent();
                            res.json(tasks);
                            return [3 /*break*/, 3];
                        case 2:
                            error_12 = _a.sent();
                            console.error("Error fetching tasks:", error_12);
                            res.status(500).json({ message: "Failed to fetch tasks" });
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            }); });
            app.get('/api/tasks/recent', isAuthenticated, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var limit, tasks, error_13;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            limit = parseInt(req.query.limit) || 3;
                            return [4 /*yield*/, storage.getRecentTasks(limit)];
                        case 1:
                            tasks = _a.sent();
                            res.json(tasks);
                            return [3 /*break*/, 3];
                        case 2:
                            error_13 = _a.sent();
                            console.error("Error fetching recent tasks:", error_13);
                            res.status(500).json({ message: "Failed to fetch recent tasks" });
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            }); });
            app.get('/api/tasks/user/:userId', isAuthenticated, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var userId, tasks, error_14;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            userId = parseInt(req.params.userId);
                            // Only admin or the user themselves can view their tasks
                            if (req.session.role !== 'admin' && req.session.userId !== userId) {
                                return [2 /*return*/, res.status(403).json({ message: "Not authorized" })];
                            }
                            return [4 /*yield*/, storage.getTasksByUser(userId)];
                        case 1:
                            tasks = _a.sent();
                            res.json(tasks);
                            return [3 /*break*/, 3];
                        case 2:
                            error_14 = _a.sent();
                            console.error("Error fetching user tasks:", error_14);
                            res.status(500).json({ message: "Failed to fetch user tasks" });
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            }); });
            app.get('/api/tasks/:id', isAuthenticated, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var taskId, task, error_15;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            taskId = parseInt(req.params.id);
                            return [4 /*yield*/, storage.getTask(taskId)];
                        case 1:
                            task = _a.sent();
                            if (!task) {
                                return [2 /*return*/, res.status(404).json({ message: "Task not found" })];
                            }
                            res.json(task);
                            return [3 /*break*/, 3];
                        case 2:
                            error_15 = _a.sent();
                            console.error("Error fetching task:", error_15);
                            res.status(500).json({ message: "Failed to fetch task" });
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            }); });
            // Create task
            app.post('/api/tasks', isAuthenticated, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var userId, taskData, newTask, error_16;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            userId = req.session.userId;
                            if (typeof userId !== "number") {
                                return [2 /*return*/, res.status(401).json({ message: "Not authenticated" })];
                            }
                            taskData = insertTaskSchema.parse(__assign(__assign({}, req.body), { createdBy: userId }));
                            return [4 /*yield*/, storage.createTask(taskData)];
                        case 1:
                            newTask = _a.sent();
                            // Create activity for task creation
                            return [4 /*yield*/, storage.createActivity({
                                    userId: userId,
                                    activityType: "task_created",
                                    description: "User created task: ".concat(newTask.title),
                                    entityId: newTask.id,
                                    entityType: "task"
                                })];
                        case 2:
                            // Create activity for task creation
                            _a.sent();
                            res.status(201).json(newTask);
                            return [3 /*break*/, 4];
                        case 3:
                            error_16 = _a.sent();
                            console.error("Error creating task:", error_16);
                            res.status(400).json({ message: "Invalid task data" });
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            }); });
            // Update task
            app.put('/api/tasks/:id', isAuthenticated, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var taskId, task, updatedTask, error_17;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 4, , 5]);
                            taskId = parseInt(req.params.id);
                            return [4 /*yield*/, storage.getTask(taskId)];
                        case 1:
                            task = _a.sent();
                            if (!task) {
                                return [2 /*return*/, res.status(404).json({ message: "Task not found" })];
                            }
                            // Only admin, creator, or assignee can update the task
                            if (req.session.role !== 'admin' &&
                                req.session.userId !== task.createdBy &&
                                req.session.userId !== task.assignedTo) {
                                return [2 /*return*/, res.status(403).json({ message: "Not authorized" })];
                            }
                            return [4 /*yield*/, storage.updateTask(taskId, req.body)];
                        case 2:
                            updatedTask = _a.sent();
                            // Create activity for task update
                            if (typeof req.session.userId !== "number") {
                                return [2 /*return*/, res.status(401).json({ message: "Not authenticated" })];
                            }
                            return [4 /*yield*/, storage.createActivity({
                                    userId: req.session.userId,
                                    activityType: "task_updated",
                                    description: "User updated task: ".concat(updatedTask === null || updatedTask === void 0 ? void 0 : updatedTask.title),
                                    entityId: taskId,
                                    entityType: "task"
                                })];
                        case 3:
                            _a.sent();
                            res.json(updatedTask);
                            return [3 /*break*/, 5];
                        case 4:
                            error_17 = _a.sent();
                            console.error("Error updating task:", error_17);
                            res.status(400).json({ message: "Invalid task data" });
                            return [3 /*break*/, 5];
                        case 5: return [2 /*return*/];
                    }
                });
            }); });
            // Delete task
            app.delete('/api/tasks/:id', isAuthenticated, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var taskId, task, result, error_18;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 6, , 7]);
                            taskId = parseInt(req.params.id);
                            return [4 /*yield*/, storage.getTask(taskId)];
                        case 1:
                            task = _a.sent();
                            if (!task) {
                                return [2 /*return*/, res.status(404).json({ message: "Task not found" })];
                            }
                            // Only admin or creator can delete the task
                            if (req.session.role !== 'admin' && req.session.userId !== task.createdBy) {
                                return [2 /*return*/, res.status(403).json({ message: "Not authorized" })];
                            }
                            return [4 /*yield*/, storage.deleteTask(taskId)];
                        case 2:
                            result = _a.sent();
                            if (!result) return [3 /*break*/, 4];
                            // Create activity for task deletion
                            if (typeof req.session.userId !== "number") {
                                return [2 /*return*/, res.status(401).json({ message: "Not authenticated" })];
                            }
                            return [4 /*yield*/, storage.createActivity({
                                    userId: req.session.userId,
                                    activityType: "task_deleted",
                                    description: "User deleted task: ".concat(task.title),
                                    entityId: taskId,
                                    entityType: "task"
                                })];
                        case 3:
                            _a.sent();
                            res.json({ message: "Task deleted successfully" });
                            return [3 /*break*/, 5];
                        case 4:
                            res.status(500).json({ message: "Failed to delete task" });
                            _a.label = 5;
                        case 5: return [3 /*break*/, 7];
                        case 6:
                            error_18 = _a.sent();
                            console.error("Error deleting task:", error_18);
                            res.status(500).json({ message: "Failed to delete task" });
                            return [3 /*break*/, 7];
                        case 7: return [2 /*return*/];
                    }
                });
            }); });
            // Note routes
            app.get('/api/tasks/:taskId/notes', isAuthenticated, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var taskId, task, notes, error_19;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            taskId = parseInt(req.params.taskId);
                            return [4 /*yield*/, storage.getTask(taskId)];
                        case 1:
                            task = _a.sent();
                            if (!task) {
                                return [2 /*return*/, res.status(404).json({ message: "Task not found" })];
                            }
                            return [4 /*yield*/, storage.getNotesByTask(taskId)];
                        case 2:
                            notes = _a.sent();
                            res.json(notes);
                            return [3 /*break*/, 4];
                        case 3:
                            error_19 = _a.sent();
                            console.error("Error fetching notes:", error_19);
                            res.status(500).json({ message: "Failed to fetch notes" });
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            }); });
            app.post('/api/tasks/:taskId/notes', isAuthenticated, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var taskId, userId, task, noteData, newNote, error_20;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 4, , 5]);
                            taskId = parseInt(req.params.taskId);
                            userId = req.session.userId;
                            return [4 /*yield*/, storage.getTask(taskId)];
                        case 1:
                            task = _a.sent();
                            if (!task) {
                                return [2 /*return*/, res.status(404).json({ message: "Task not found" })];
                            }
                            if (typeof userId !== "number") {
                                return [2 /*return*/, res.status(401).json({ message: "Not authenticated" })];
                            }
                            noteData = insertNoteSchema.parse({
                                taskId: taskId,
                                userId: userId,
                                content: req.body.content
                            });
                            return [4 /*yield*/, storage.createNote(noteData)];
                        case 2:
                            newNote = _a.sent();
                            // Create activity for note creation
                            return [4 /*yield*/, storage.createActivity({
                                    userId: userId,
                                    activityType: "note_added",
                                    description: "User added a note to task: ".concat(task.title),
                                    entityId: newNote.id,
                                    entityType: "note"
                                })];
                        case 3:
                            // Create activity for note creation
                            _a.sent();
                            res.status(201).json(newNote);
                            return [3 /*break*/, 5];
                        case 4:
                            error_20 = _a.sent();
                            console.error("Error creating note:", error_20);
                            res.status(400).json({ message: "Invalid note data" });
                            return [3 /*break*/, 5];
                        case 5: return [2 /*return*/];
                    }
                });
            }); });
            // Photo routes
            app.get('/api/tasks/:taskId/photos', isAuthenticated, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var taskId, task, photos, error_21;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            taskId = parseInt(req.params.taskId);
                            return [4 /*yield*/, storage.getTask(taskId)];
                        case 1:
                            task = _a.sent();
                            if (!task) {
                                return [2 /*return*/, res.status(404).json({ message: "Task not found" })];
                            }
                            return [4 /*yield*/, storage.getPhotosByTask(taskId)];
                        case 2:
                            photos = _a.sent();
                            res.json(photos);
                            return [3 /*break*/, 4];
                        case 3:
                            error_21 = _a.sent();
                            console.error("Error fetching photos:", error_21);
                            res.status(500).json({ message: "Failed to fetch photos" });
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            }); });
            app.post('/api/tasks/:taskId/photos', isAuthenticated, upload.single('photo'), function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var taskId, userId, task, imageUrl, photoData, newPhoto, error_22;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 4, , 5]);
                            taskId = parseInt(req.params.taskId);
                            userId = req.session.userId;
                            if (typeof userId !== "number") {
                                return [2 /*return*/, res.status(401).json({ message: "Not authenticated" })];
                            }
                            return [4 /*yield*/, storage.getTask(taskId)];
                        case 1:
                            task = _a.sent();
                            if (!task) {
                                return [2 /*return*/, res.status(404).json({ message: "Task not found" })];
                            }
                            if (!req.file) {
                                return [2 /*return*/, res.status(400).json({ message: "No photo uploaded" })];
                            }
                            imageUrl = "/uploads/".concat(req.file.filename);
                            photoData = insertPhotoSchema.parse({
                                taskId: taskId,
                                userId: userId,
                                imageUrl: imageUrl,
                                caption: req.body.caption || "",
                                createdAt: new Date()
                            });
                            return [4 /*yield*/, storage.createPhoto(photoData)];
                        case 2:
                            newPhoto = _a.sent();
                            // Create activity for photo upload
                            return [4 /*yield*/, storage.createActivity({
                                    userId: userId,
                                    activityType: "photo_uploaded",
                                    description: "User uploaded a photo to task: ".concat(task.title),
                                    entityId: newPhoto.id,
                                    entityType: "photo"
                                })];
                        case 3:
                            // Create activity for photo upload
                            _a.sent();
                            res.status(201).json(newPhoto);
                            return [3 /*break*/, 5];
                        case 4:
                            error_22 = _a.sent();
                            console.error("Error uploading photo:", error_22);
                            res.status(400).json({ message: "Invalid photo data" });
                            return [3 /*break*/, 5];
                        case 5: return [2 /*return*/];
                    }
                });
            }); });
            // Activity routes
            app.get('/api/activities/recent', isAuthenticated, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var limit, activities, error_23;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            limit = parseInt(req.query.limit) || 5;
                            return [4 /*yield*/, storage.getRecentActivities(limit)];
                        case 1:
                            activities = _a.sent();
                            res.json(activities);
                            return [3 /*break*/, 3];
                        case 2:
                            error_23 = _a.sent();
                            console.error("Error fetching activities:", error_23);
                            res.status(500).json({ message: "Failed to fetch activities" });
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            }); });
            httpServer = createServer(app);
            return [2 /*return*/, httpServer];
        });
    });
}
