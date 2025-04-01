
import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { LogOut, BookOpen, FileText, MessageSquare, Activity, Calendar, User, UserPlus, UserCheck } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export function AppSidebar() {
  const { user, logout, isAdmin, isInstructor, isStudent } = useAuth();
  const location = useLocation();

  // Base menu items for all users
  const menuItems = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: Activity,
    },
    {
      title: "Courses",
      url: "/courses",
      icon: BookOpen,
    },
  ];

  // Role-specific menu items
  if (isAdmin) {
    menuItems.push(
      {
        title: "User Management",
        url: "/users",
        icon: UserPlus,
      }
    );
  }

  if (isInstructor) {
    menuItems.push(
      {
        title: "Assignments",
        url: "/assignments",
        icon: FileText,
      },
      {
        title: "Attendance",
        url: "/attendance",
        icon: Calendar,
      }
    );
  }

  if (isStudent) {
    menuItems.push(
      {
        title: "Assignments",
        url: "/assignments",
        icon: FileText,
      },
      {
        title: "Discussions",
        url: "/discussions",
        icon: MessageSquare,
      },
      {
        title: "My Attendance",
        url: "/my-attendance",
        icon: Calendar,
      }
    );
  }

  // All users get profile
  menuItems.push({
    title: "Profile",
    url: "/profile",
    icon: User,
  });

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
            <BookOpen className="h-6 w-6 text-sidebar-background" />
          </div>
          <h1 className="text-xl font-bold text-white">College LMS</h1>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild active={location.pathname === item.url}>
                    <Link to={item.url}>
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="p-4 space-y-4">
          {user && (
            <div className="flex items-center space-x-3 mb-4">
              <img 
                src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}`} 
                alt={user.name} 
                className="w-10 h-10 rounded-full"
              />
              <div>
                <p className="text-sm font-medium text-white">{user.name}</p>
                <p className="text-xs text-white/70 capitalize">{user.role}</p>
              </div>
            </div>
          )}
          <Button 
            variant="outline" 
            className="w-full bg-sidebar-accent text-white border-sidebar-border hover:bg-sidebar-accent/80"
            onClick={logout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
