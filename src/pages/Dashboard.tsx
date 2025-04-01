
import React from "react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BookOpen, FileText, MessageSquare, Calendar, AlertCircle } from "lucide-react";
import { getCoursesByUserId, getAssignmentsByCourseId, calculateAttendancePercentage } from "@/data/mockData";

const Dashboard = () => {
  const { user } = useAuth();
  
  if (!user) return null;
  
  const courses = getCoursesByUserId(user.id, user.role);
  
  const upcomingAssignments = courses.flatMap(course => {
    return getAssignmentsByCourseId(course.id)
      .filter(assignment => new Date(assignment.dueDate) > new Date())
      .map(assignment => ({ ...assignment, course }));
  }).sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()).slice(0, 3);

  return (
    <div>
      <h1 className="lms-page-title">Dashboard</h1>
      
      <div className="grid gap-6">
        <section>
          <h2 className="lms-subheader mb-4">Welcome, {user.name}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Courses</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{courses.length}</div>
                <p className="text-xs text-muted-foreground">
                  {user.role === "instructor" 
                    ? "Courses you're teaching" 
                    : user.role === "student" 
                      ? "Courses enrolled" 
                      : "Total courses"}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Assignments</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {upcomingAssignments.length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Upcoming assignments
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Forum Activity</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2</div>
                <p className="text-xs text-muted-foreground">
                  Unread discussions
                </p>
              </CardContent>
            </Card>
            
            {user.role === "student" && (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Average Attendance</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  {courses.length > 0 ? (
                    <>
                      <div className="text-2xl font-bold">
                        {Math.round(
                          courses.reduce(
                            (sum, course) => sum + calculateAttendancePercentage(course.id, user.id), 
                            0
                          ) / courses.length
                        )}%
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Across all courses
                      </p>
                    </>
                  ) : (
                    <p className="text-sm text-muted-foreground">No courses</p>
                  )}
                </CardContent>
              </Card>
            )}
            
            {user.role === "instructor" && (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">To Grade</CardTitle>
                  <AlertCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">3</div>
                  <p className="text-xs text-muted-foreground">
                    Pending submissions
                  </p>
                </CardContent>
              </Card>
            )}
            
            {user.role === "admin" && (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">System Status</CardTitle>
                  <AlertCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-500">Healthy</div>
                  <p className="text-xs text-muted-foreground">
                    All systems operational
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </section>
        
        <section>
          <h2 className="lms-subheader mb-4">My Courses</h2>
          
          <div className="grid gap-4">
            {courses.length > 0 ? (
              courses.map((course) => (
                <Card key={course.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{course.title}</CardTitle>
                        <CardDescription>{course.code}</CardDescription>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {course.schedule.map((s, i) => (
                          <div key={i}>
                            {s.day} {s.startTime}-{s.endTime}
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <div className="text-sm">Course Progress</div>
                          <div className="text-sm">45%</div>
                        </div>
                        <Progress value={45} className="h-2" />
                      </div>
                      
                      {user.role === "student" && (
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <div className="text-sm">Attendance</div>
                            <div className="text-sm">
                              {Math.round(calculateAttendancePercentage(course.id, user.id))}%
                            </div>
                          </div>
                          <Progress 
                            value={calculateAttendancePercentage(course.id, user.id)} 
                            className="h-2"
                          />
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <BookOpen className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                    <p>No courses found</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </section>
        
        <section>
          <h2 className="lms-subheader mb-4">Upcoming Assignments</h2>
          
          <div className="grid gap-4">
            {upcomingAssignments.length > 0 ? (
              upcomingAssignments.map((assignment) => (
                <Card key={assignment.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{assignment.title}</CardTitle>
                        <CardDescription>{assignment.course.title} ({assignment.course.code})</CardDescription>
                      </div>
                      <div className="text-sm font-medium">
                        Due: {new Date(assignment.dueDate).toLocaleDateString()}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {assignment.description}
                    </p>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <FileText className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                    <p>No upcoming assignments</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
