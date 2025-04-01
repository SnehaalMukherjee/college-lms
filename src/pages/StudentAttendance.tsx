
import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckCircle2, XCircle, Clock, AlertTriangle } from "lucide-react";
import { getAttendanceByStudentId, getCoursesByUserId } from "@/data/mockData";

const StudentAttendance = () => {
  const { user } = useAuth();
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  
  if (!user) return null;
  
  // Only students can access this page
  if (user.role !== "student") {
    return (
      <div className="text-center p-12">
        <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
        <p>You don't have permission to access this page.</p>
      </div>
    );
  }
  
  const courses = getCoursesByUserId(user.id, user.role);
  const attendanceData = getAttendanceByStudentId(user.id);
  
  // Set initial selected course if not set yet
  if (!selectedCourseId && courses.length > 0 && !selectedCourseId) {
    setSelectedCourseId(courses[0].id);
  }
  
  const selectedCourseAttendance = attendanceData.find(data => data.course.id === selectedCourseId);
  
  // Calculate statistics
  const getAttendanceStats = (records: any[]) => {
    if (!records || records.length === 0) return { present: 0, absent: 0, late: 0, excused: 0, total: 0 };
    
    const stats = {
      present: 0,
      absent: 0,
      late: 0,
      excused: 0,
      total: records.length
    };
    
    records.forEach(record => {
      const studentRecord = record.records.find((r: any) => r.studentId === user.id);
      if (studentRecord) {
        stats[studentRecord.status as keyof typeof stats]++;
      }
    });
    
    return stats;
  };
  
  const selectedStats = selectedCourseAttendance 
    ? getAttendanceStats(selectedCourseAttendance.attendanceRecords) 
    : { present: 0, absent: 0, late: 0, excused: 0, total: 0 };
  
  // Calculate percentage
  const calculatePercentage = (value: number, total: number) => {
    if (total === 0) return 0;
    return Math.round((value / total) * 100);
  };
  
  // Present percentage includes both present and late
  const presentPercentage = calculatePercentage(selectedStats.present + selectedStats.late, selectedStats.total);
  
  // Status icon mapping
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "present":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "absent":
        return <XCircle className="h-5 w-5 text-red-500" />;
      case "late":
        return <Clock className="h-5 w-5 text-amber-500" />;
      case "excused":
        return <AlertTriangle className="h-5 w-5 text-blue-500" />;
      default:
        return null;
    }
  };

  return (
    <div>
      <h1 className="lms-page-title">My Attendance</h1>
      
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Select Course</label>
        <Select value={selectedCourseId || ""} onValueChange={setSelectedCourseId}>
          <SelectTrigger className="w-full sm:w-72">
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
      
      {selectedCourseAttendance && (
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Attendance Summary</CardTitle>
              <CardDescription>
                {selectedCourseAttendance.course.title} ({selectedCourseAttendance.course.code})
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <div className="font-medium">Overall Attendance</div>
                    <div className="text-sm font-medium">{presentPercentage}%</div>
                  </div>
                  <Progress value={presentPercentage} className="h-2" />
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-green-50 rounded-lg p-4 text-center">
                    <div className="flex justify-center mb-2">
                      <CheckCircle2 className="h-6 w-6 text-green-500" />
                    </div>
                    <div className="text-lg font-bold">{selectedStats.present}</div>
                    <div className="text-sm text-muted-foreground">Present</div>
                  </div>
                  
                  <div className="bg-red-50 rounded-lg p-4 text-center">
                    <div className="flex justify-center mb-2">
                      <XCircle className="h-6 w-6 text-red-500" />
                    </div>
                    <div className="text-lg font-bold">{selectedStats.absent}</div>
                    <div className="text-sm text-muted-foreground">Absent</div>
                  </div>
                  
                  <div className="bg-amber-50 rounded-lg p-4 text-center">
                    <div className="flex justify-center mb-2">
                      <Clock className="h-6 w-6 text-amber-500" />
                    </div>
                    <div className="text-lg font-bold">{selectedStats.late}</div>
                    <div className="text-sm text-muted-foreground">Late</div>
                  </div>
                  
                  <div className="bg-blue-50 rounded-lg p-4 text-center">
                    <div className="flex justify-center mb-2">
                      <AlertTriangle className="h-6 w-6 text-blue-500" />
                    </div>
                    <div className="text-lg font-bold">{selectedStats.excused}</div>
                    <div className="text-sm text-muted-foreground">Excused</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Detailed Attendance Records</CardTitle>
              <CardDescription>Day-wise attendance for this course</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="list">
                <TabsList className="mb-4">
                  <TabsTrigger value="list">List View</TabsTrigger>
                  <TabsTrigger value="calendar">Calendar View</TabsTrigger>
                </TabsList>
                
                <TabsContent value="list">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Day</TableHead>
                        <TableHead>Time</TableHead>
                        <TableHead className="text-right">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedCourseAttendance.attendanceRecords.map((record) => {
                        const studentRecord = record.records.find(r => r.studentId === user.id);
                        const date = new Date(record.date);
                        const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
                        
                        // Find the schedule for this day
                        const schedule = selectedCourseAttendance.course.schedule.find(
                          s => s.day === dayOfWeek
                        );
                        
                        return (
                          <TableRow key={record.id}>
                            <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
                            <TableCell>{dayOfWeek}</TableCell>
                            <TableCell>
                              {schedule ? `${schedule.startTime} - ${schedule.endTime}` : "N/A"}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end space-x-2">
                                <span className="capitalize">{studentRecord?.status || "N/A"}</span>
                                {studentRecord && getStatusIcon(studentRecord.status)}
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TabsContent>
                
                <TabsContent value="calendar">
                  <div className="text-center p-8 border rounded-lg">
                    <p className="text-muted-foreground">
                      Calendar view will be implemented in a future update
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default StudentAttendance;
