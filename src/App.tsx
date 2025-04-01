
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";

// Layout
import { MainLayout } from "@/components/MainLayout";

// Pages
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Courses from "./pages/Courses";
import Assignments from "./pages/Assignments";
import Attendance from "./pages/Attendance";
import StudentAttendance from "./pages/StudentAttendance";
import Discussions from "./pages/Discussions";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route 
              path="/login" 
              element={
                <MainLayout requireAuth={false}>
                  <Login />
                </MainLayout>
              } 
            />
            
            {/* Protected routes */}
            <Route 
              path="/" 
              element={
                <MainLayout>
                  <Dashboard />
                </MainLayout>
              } 
            />
            <Route 
              path="/dashboard" 
              element={
                <MainLayout>
                  <Dashboard />
                </MainLayout>
              } 
            />
            <Route 
              path="/courses" 
              element={
                <MainLayout>
                  <Courses />
                </MainLayout>
              } 
            />
            <Route 
              path="/assignments" 
              element={
                <MainLayout>
                  <Assignments />
                </MainLayout>
              } 
            />
            <Route 
              path="/attendance" 
              element={
                <MainLayout>
                  <Attendance />
                </MainLayout>
              } 
            />
            <Route 
              path="/my-attendance" 
              element={
                <MainLayout>
                  <StudentAttendance />
                </MainLayout>
              } 
            />
            <Route 
              path="/discussions" 
              element={
                <MainLayout>
                  <Discussions />
                </MainLayout>
              } 
            />
            
            {/* 404 route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
