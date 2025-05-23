import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { LayoutDashboard, Users, Calendar, ClipboardCheck, PieChart, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface SidebarProps {
  isMobile?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
}

const Sidebar = ({ isMobile = false, isOpen = false, onClose }: SidebarProps) => {
  const { user } = useAuth();
  const [location] = useLocation();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await apiRequest("POST", "/api/auth/logout", {});
      queryClient.invalidateQueries({ queryKey: ["/api/auth/current-user"] });
      toast({
        title: "Logged out successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Logout failed",
        description: "Please try again",
      });
    }
  };

  // Close sidebar when route changes on mobile
  useEffect(() => {
    if (isMobile && isOpen && onClose) {
      onClose();
    }
  }, [location, isMobile, isOpen, onClose]);

  const sidebarClasses = cn(
    "sidebar fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg dark:bg-sidebar lg:relative lg:translate-x-0 lg:shadow-none dark:border-r dark:border-neutral-800",
    {
      "open": isOpen && isMobile,
    }
  );

  return (
    <aside className={sidebarClasses}>
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex items-center justify-center border-b border-neutral-200 py-6 dark:border-neutral-800">
          <h1 className="text-2xl font-bold text-primary-600">WorkTrack Pro</h1>
        </div>
        
        {/* Nav Links */}
        <nav className="flex-1 overflow-y-auto p-4">
          <div className="space-y-1">
            <Link href="/">
              <a className={cn(
                "flex items-center rounded-md px-4 py-3 text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800",
                location === "/" && "bg-primary-50 text-primary-700 dark:bg-primary-900 dark:text-primary-300"
              )}>
                <LayoutDashboard className="mr-3 h-5 w-5" />
                <span className="font-medium">Dashboard</span>
              </a>
            </Link>
            <Link href="/employees">
              <a className={cn(
                "flex items-center rounded-md px-4 py-3 text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800",
                location.startsWith("/employees") && "bg-primary-50 text-primary-700 dark:bg-primary-900 dark:text-primary-300"
              )}>
                <Users className="mr-3 h-5 w-5" />
                <span className="font-medium">Employees</span>
              </a>
            </Link>
            <Link href="/attendance">
              <a className={cn(
                "flex items-center rounded-md px-4 py-3 text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800",
                location.startsWith("/attendance") && "bg-primary-50 text-primary-700 dark:bg-primary-900 dark:text-primary-300"
              )}>
                <Calendar className="mr-3 h-5 w-5" />
                <span className="font-medium">Attendance</span>
              </a>
            </Link>
            <Link href="/tasks">
              <a className={cn(
                "flex items-center rounded-md px-4 py-3 text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800",
                location.startsWith("/tasks") && "bg-primary-50 text-primary-700 dark:bg-primary-900 dark:text-primary-300"
              )}>
                <ClipboardCheck className="mr-3 h-5 w-5" />
                <span className="font-medium">Tasks</span>
              </a>
            </Link>
            <Link href="/reports">
              <a className={cn(
                "flex items-center rounded-md px-4 py-3 text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800",
                location.startsWith("/reports") && "bg-primary-50 text-primary-700 dark:bg-primary-900 dark:text-primary-300"
              )}>
                <PieChart className="mr-3 h-5 w-5" />
                <span className="font-medium">Reports</span>
              </a>
            </Link>
          </div>
        </nav>
        
        {/* User profile */}
        <div className="border-t border-neutral-200 p-4 dark:border-neutral-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <img 
                src={user?.profileImageUrl || `https://ui-avatars.com/api/?name=${user?.firstName}+${user?.lastName}`} 
                alt="User profile" 
                className="h-8 w-8 rounded-full object-cover" 
              />
              <div className="ml-3">
                <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 capitalize">
                  {user?.role}
                </p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleLogout}
              className="h-8 w-8 text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
