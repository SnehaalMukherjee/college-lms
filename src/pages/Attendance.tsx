
import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar as CalendarIcon, CheckCircle2, XCircle, Clock, AlertTriangle } from "lucide-react";
import { getCoursesByUserId, attendance } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";

const Attendance = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [date, setDate] = useState<Date | undefined>(new Date());
  
  if (!user) return null;
  
  const courses = getCoursesByUserId(user.id, user.role);
  
  // Only instructors and admins can access this page
  if (user.role !== "instructor" && user.role !== "admin") {
    return (
      <div className="text-center p-12">
        <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
        <p>You don't have permission to access this page.</p>
      </div>
    );
  }

  const selectedCourseData = courses.find(c => c.id === selectedCourse);

  // Mock student data for the selected course
  const studentsInCourse = selectedCourseData 
    ? [
        { id: "3", name: "Student Doe", email: "student@college.edu" }
      ]
    : [];

  // Get existing attendance for this date and course
  const formattedDate = date ? format(date, 'yyyy-MM-dd') : '';
  const existingAttendance = selectedCourse && formattedDate
    ? attendance.find(a => a.courseId === selectedCourse && a.date === formattedDate)
    : null;

  const handleMarkAttendance = (studentId: string, status: "present" | "absent" | "late" | "excused") => {
    toast({
      title: "Attendance Marked",
      description: `Student attendance recorded as ${status}`,
    });
  };

  return (
    <div>
      <h1 className="lms-page-title">Attendance Management</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Take Attendance</CardTitle>
          <CardDescription>
            Select a course and date to mark attendance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Course
              </label>
              <Select onValueChange={setSelectedCourse}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a course" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((course) => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.title} ({course.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Date
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    {date ? format(date, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {selectedCourse && date && (
        <Card>
          <CardHeader>
            <CardTitle>
              {selectedCourseData?.title} ({selectedCourseData?.code})
            </CardTitle>
            <CardDescription>
              Attendance for {date ? format(date, "PPPP") : ""}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {studentsInCourse.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead className="text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {studentsInCourse.map((student) => {
                    // Get existing status for this student
                    const studentRecord = existingAttendance?.records.find(
                      r => r.studentId === student.id
                    );
                    
                    return (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium">{student.name}</TableCell>
                        <TableCell>{student.email}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className={cn(
                                "h-8 w-8",
                                studentRecord?.status === "present" && "bg-green-100 text-green-600 border-green-200"
                              )}
                              onClick={() => handleMarkAttendance(student.id, "present")}
                            >
                              <CheckCircle2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              className={cn(
                                "h-8 w-8",
                                studentRecord?.status === "absent" && "bg-red-100 text-red-600 border-red-200"
                              )}
                              onClick={() => handleMarkAttendance(student.id, "absent")}
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              className={cn(
                                "h-8 w-8",
                                studentRecord?.status === "late" && "bg-amber-100 text-amber-600 border-amber-200"
                              )}
                              onClick={() => handleMarkAttendance(student.id, "late")}
                            >
                              <Clock className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              className={cn(
                                "h-8 w-8",
                                studentRecord?.status === "excused" && "bg-blue-100 text-blue-600 border-blue-200"
                              )}
                              onClick={() => handleMarkAttendance(student.id, "excused")}
                            >
                              <AlertTriangle className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-4">
                <p className="text-muted-foreground">No students enrolled in this course</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Attendance;
