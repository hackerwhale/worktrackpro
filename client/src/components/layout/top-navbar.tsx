import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { Bell, ChevronDown, Menu } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { useTheme } from "@/components/layout/theme-provider";
import { Moon, Sun } from "lucide-react";

interface TopNavbarProps {
  onMenuClick: () => void;
}

const TopNavbar = ({ onMenuClick }: TopNavbarProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [location] = useLocation();
  const { theme, setTheme } = useTheme();

  const getPageTitle = () => {
    if (location.startsWith("/employees")) return "Employees";
    if (location.startsWith("/attendance")) return "Attendance";
    if (location.startsWith("/tasks")) return "Tasks";
    if (location.startsWith("/reports")) return "Reports";
    return "Dashboard";
  };

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

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <header className="bg-white shadow-sm dark:bg-card">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center">
          <Button
            id="menu-button"
            onClick={onMenuClick}
            variant="ghost"
            size="icon"
            className="mr-2 lg:hidden"
          >
            <Menu className="h-6 w-6" />
          </Button>
          <h2 className="text-xl font-semibold text-neutral-800 dark:text-neutral-200">{getPageTitle()}</h2>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={toggleTheme} className="text-neutral-500 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800">
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          
          <Button variant="ghost" size="icon" className="relative text-neutral-500 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800">
            <Bell className="h-5 w-5" />
            <span className="absolute right-1 top-1 flex h-2 w-2 rounded-full bg-error-500"></span>
          </Button>
          
          <div className="h-6 w-px bg-neutral-200 dark:bg-neutral-700"></div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center text-sm font-medium text-neutral-700 dark:text-neutral-300">
                <span className="hidden md:block">
                  {user?.firstName} {user?.lastName}
                </span>
                <ChevronDown className="ml-1 h-4 w-4 text-neutral-400" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="cursor-pointer">Profile</DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">Settings</DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default TopNavbar;
