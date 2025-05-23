import { useState, useEffect } from "react";
import Sidebar from "./sidebar";
import TopNavbar from "./top-navbar";
import MobileNav from "./mobile-nav";
import { useAuth } from "@/hooks/use-auth";

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user } = useAuth();

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.getElementById("sidebar");
      const menuButton = document.getElementById("menu-button");
      
      if (sidebar && 
          !sidebar.contains(event.target as Node) && 
          menuButton && 
          !menuButton.contains(event.target as Node) && 
          window.innerWidth < 1024) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  if (!user) return null;

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar 
        isMobile={true} 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Navigation Bar */}
        <TopNavbar onMenuClick={toggleSidebar} />

        {/* Main Content Container */}
        <main className="flex-1 overflow-y-auto bg-neutral-50 p-4 md:p-6 dark:bg-background">
          {children}
        </main>
        
        {/* Mobile Navigation */}
        <MobileNav />
      </div>
    </div>
  );
};

export default AppLayout;
