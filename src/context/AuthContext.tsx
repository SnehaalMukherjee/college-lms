
import React, { createContext, useState, useContext, useEffect } from "react";

// User roles
export type UserRole = "admin" | "instructor" | "student";

// User type
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

// Auth context type
interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isInstructor: boolean;
  isStudent: boolean;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo
const mockUsers: User[] = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@college.edu",
    role: "admin",
    avatar: "https://ui-avatars.com/api/?name=Admin+User&background=4f46e5&color=fff",
  },
  {
    id: "2",
    name: "Teacher Smith",
    email: "teacher@college.edu",
    role: "instructor",
    avatar: "https://ui-avatars.com/api/?name=Teacher+Smith&background=0d9488&color=fff",
  },
  {
    id: "3",
    name: "Student Doe",
    email: "student@college.edu",
    role: "student",
    avatar: "https://ui-avatars.com/api/?name=Student+Doe&background=f59e0b&color=fff",
  },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session
  useEffect(() => {
    const storedUser = localStorage.getItem("lmsUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    setLoading(true);
    
    try {
      // In a real app, this would be an API call
      const foundUser = mockUsers.find(u => u.email === email);
      
      if (!foundUser) {
        throw new Error("Invalid credentials");
      }
      
      // Store user in local storage
      localStorage.setItem("lmsUser", JSON.stringify(foundUser));
      setUser(foundUser);
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("lmsUser");
    setUser(null);
  };

  // Role-based checks
  const isAuthenticated = !!user;
  const isAdmin = user?.role === "admin";
  const isInstructor = user?.role === "instructor";
  const isStudent = user?.role === "student";

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAuthenticated,
        isAdmin,
        isInstructor,
        isStudent,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook for using auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
