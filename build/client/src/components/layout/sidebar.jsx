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
import { useEffect } from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { LayoutDashboard, Users, Calendar, ClipboardCheck, PieChart, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
var Sidebar = function (_a) {
    var _b = _a.isMobile, isMobile = _b === void 0 ? false : _b, _c = _a.isOpen, isOpen = _c === void 0 ? false : _c, onClose = _a.onClose;
    var user = useAuth().user;
    var location = useLocation()[0];
    var toast = useToast().toast;
    var handleLogout = function () { return __awaiter(void 0, void 0, void 0, function () {
        var error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, apiRequest("POST", "/api/auth/logout", {})];
                case 1:
                    _a.sent();
                    queryClient.invalidateQueries({ queryKey: ["/api/auth/current-user"] });
                    toast({
                        title: "Logged out successfully",
                    });
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    toast({
                        variant: "destructive",
                        title: "Logout failed",
                        description: "Please try again",
                    });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    // Close sidebar when route changes on mobile
    useEffect(function () {
        if (isMobile && isOpen && onClose) {
            onClose();
        }
    }, [location, isMobile, isOpen, onClose]);
    var sidebarClasses = cn("sidebar fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg dark:bg-sidebar lg:relative lg:translate-x-0 lg:shadow-none dark:border-r dark:border-neutral-800", {
        "open": isOpen && isMobile,
    });
    return (<aside className={sidebarClasses}>
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex items-center justify-center border-b border-neutral-200 py-6 dark:border-neutral-800">
          <h1 className="text-2xl font-bold text-primary-600">WorkTrack Pro</h1>
        </div>
        
        {/* Nav Links */}
        <nav className="flex-1 overflow-y-auto p-4">
          <div className="space-y-1">
            <Link href="/">
              <a className={cn("flex items-center rounded-md px-4 py-3 text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800", location === "/" && "bg-primary-50 text-primary-700 dark:bg-primary-900 dark:text-primary-300")}>
                <LayoutDashboard className="mr-3 h-5 w-5"/>
                <span className="font-medium">Dashboard</span>
              </a>
            </Link>
            <Link href="/employees">
              <a className={cn("flex items-center rounded-md px-4 py-3 text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800", location.startsWith("/employees") && "bg-primary-50 text-primary-700 dark:bg-primary-900 dark:text-primary-300")}>
                <Users className="mr-3 h-5 w-5"/>
                <span className="font-medium">Employees</span>
              </a>
            </Link>
            <Link href="/attendance">
              <a className={cn("flex items-center rounded-md px-4 py-3 text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800", location.startsWith("/attendance") && "bg-primary-50 text-primary-700 dark:bg-primary-900 dark:text-primary-300")}>
                <Calendar className="mr-3 h-5 w-5"/>
                <span className="font-medium">Attendance</span>
              </a>
            </Link>
            <Link href="/tasks">
              <a className={cn("flex items-center rounded-md px-4 py-3 text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800", location.startsWith("/tasks") && "bg-primary-50 text-primary-700 dark:bg-primary-900 dark:text-primary-300")}>
                <ClipboardCheck className="mr-3 h-5 w-5"/>
                <span className="font-medium">Tasks</span>
              </a>
            </Link>
            <Link href="/reports">
              <a className={cn("flex items-center rounded-md px-4 py-3 text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800", location.startsWith("/reports") && "bg-primary-50 text-primary-700 dark:bg-primary-900 dark:text-primary-300")}>
                <PieChart className="mr-3 h-5 w-5"/>
                <span className="font-medium">Reports</span>
              </a>
            </Link>
          </div>
        </nav>
        
        {/* User profile */}
        <div className="border-t border-neutral-200 p-4 dark:border-neutral-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <img src={(user === null || user === void 0 ? void 0 : user.profileImageUrl) || "https://ui-avatars.com/api/?name=".concat(user === null || user === void 0 ? void 0 : user.firstName, "+").concat(user === null || user === void 0 ? void 0 : user.lastName)} alt="User profile" className="h-8 w-8 rounded-full object-cover"/>
              <div className="ml-3">
                <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
                  {user === null || user === void 0 ? void 0 : user.firstName} {user === null || user === void 0 ? void 0 : user.lastName}
                </p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 capitalize">
                  {user === null || user === void 0 ? void 0 : user.role}
                </p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={handleLogout} className="h-8 w-8 text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200">
              <LogOut className="h-4 w-4"/>
            </Button>
          </div>
        </div>
      </div>
    </aside>);
};
export default Sidebar;
