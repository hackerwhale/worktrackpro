import { useState, useEffect } from "react";
import Sidebar from "./sidebar";
import TopNavbar from "./top-navbar";
import MobileNav from "./mobile-nav";
import { useAuth } from "@/hooks/use-auth";
var AppLayout = function (_a) {
    var children = _a.children;
    var _b = useState(false), isSidebarOpen = _b[0], setIsSidebarOpen = _b[1];
    var user = useAuth().user;
    // Close sidebar when clicking outside on mobile
    useEffect(function () {
        var handleClickOutside = function (event) {
            var sidebar = document.getElementById("sidebar");
            var menuButton = document.getElementById("menu-button");
            if (sidebar &&
                !sidebar.contains(event.target) &&
                menuButton &&
                !menuButton.contains(event.target) &&
                window.innerWidth < 1024) {
                setIsSidebarOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return function () {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);
    // Handle window resize
    useEffect(function () {
        var handleResize = function () {
            if (window.innerWidth >= 1024) {
                setIsSidebarOpen(false);
            }
        };
        window.addEventListener("resize", handleResize);
        return function () {
            window.removeEventListener("resize", handleResize);
        };
    }, []);
    var toggleSidebar = function () {
        setIsSidebarOpen(!isSidebarOpen);
    };
    if (!user)
        return null;
    return (<div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar isMobile={true} isOpen={isSidebarOpen} onClose={function () { return setIsSidebarOpen(false); }}/>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Navigation Bar */}
        <TopNavbar onMenuClick={toggleSidebar}/>

        {/* Main Content Container */}
        <main className="flex-1 overflow-y-auto bg-neutral-50 p-4 md:p-6 dark:bg-background">
          {children}
        </main>
        
        {/* Mobile Navigation */}
        <MobileNav />
      </div>
    </div>);
};
export default AppLayout;
