"use client";

import React, { useState } from "react";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { MobileNav } from "./MobileNav";
import { RightSidebar } from "./RightSidebar";
import { cn } from "@/lib/utils";

export function AppShell({
  children,
  showRightSidebar = true,
  rightSidebarContent = null,
  hideRoomsInRightSidebar = false,
  className = "",
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-blue-50 dark:bg-gray-800 flex flex-col">
      {/* Mobile Nav */}
      <MobileNav isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

      <div className="flex flex-1 w-full">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block w-64 flex-shrink-0 sticky top-0 h-screen z-30">
          <Sidebar />
        </div>

        {/* Content Column */}
        <div className="flex-1 flex flex-col min-w-0 pb-14 lg:pb-0">
          <TopBar onOpenMobileMenu={() => setIsMobileMenuOpen(true)} />

          <main className="flex-1 p-4">
            <div className={cn(
              "grid grid-cols-1 gap-4",
              showRightSidebar ? "xl:grid-cols-[1fr,280px]" : "",
              className
            )}>
              <div className="min-w-0">{children}</div>
              {showRightSidebar && (
                <div className="hidden xl:block">
                  {rightSidebarContent || <RightSidebar hideRooms={hideRoomsInRightSidebar} />}
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
