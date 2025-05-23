import { Home, Users, Calendar, ClipboardCheck, Activity } from "lucide-react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";

const MobileNav = () => {
  const [location] = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-neutral-200 bg-white shadow-lg dark:border-neutral-800 dark:bg-card lg:hidden">
      <div className="flex h-16 items-center justify-around">
        <Link href="/">
          <a className={cn(
            "flex flex-col items-center text-neutral-600 dark:text-neutral-400",
            location === "/" && "text-primary-500 dark:text-primary-400"
          )}>
            <Home className="h-6 w-6" />
            <span className="mt-1 text-xs">Dashboard</span>
          </a>
        </Link>
        
        <Link href="/employees">
          <a className={cn(
            "flex flex-col items-center text-neutral-600 dark:text-neutral-400",
            location.startsWith("/employees") && "text-primary-500 dark:text-primary-400"
          )}>
            <Users className="h-6 w-6" />
            <span className="mt-1 text-xs">Employees</span>
          </a>
        </Link>
        
        <Link href="/attendance">
          <a className={cn(
            "flex flex-col items-center text-neutral-600 dark:text-neutral-400",
            location.startsWith("/attendance") && "text-primary-500 dark:text-primary-400"
          )}>
            <Calendar className="h-6 w-6" />
            <span className="mt-1 text-xs">Attendance</span>
          </a>
        </Link>
        
        <Link href="/tasks">
          <a className={cn(
            "flex flex-col items-center text-neutral-600 dark:text-neutral-400",
            location.startsWith("/tasks") && "text-primary-500 dark:text-primary-400"
          )}>
            <ClipboardCheck className="h-6 w-6" />
            <span className="mt-1 text-xs">Tasks</span>
          </a>
        </Link>
      </div>
    </nav>
  );
};

export default MobileNav;
