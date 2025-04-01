
import React from "react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getCoursesByUserId } from "@/data/mockData";

const Courses = () => {
  const { user } = useAuth();
  
  if (!user) return null;
  
  const courses = getCoursesByUserId(user.id, user.role);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="lms-page-title">Courses</h1>
        {(user.role === "admin" || user.role === "instructor") && (
          <Button>
            {user.role === "admin" ? "Add New Course" : "Request New Course"}
          </Button>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {courses.length > 0 ? (
          courses.map((course) => (
            <Card key={course.id} className="flex flex-col">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{course.title}</CardTitle>
                    <CardDescription>{course.code}</CardDescription>
                  </div>
                  <Badge>{course.enrolledStudents.length} students</Badge>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-muted-foreground mb-4">
                  {course.description}
                </p>
                <div className="text-sm space-y-1">
                  <div className="font-medium">Schedule:</div>
                  {course.schedule.map((s, i) => (
                    <div key={i} className="text-muted-foreground">
                      {s.day} {s.startTime}-{s.endTime}
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">View Course</Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center p-12 border rounded-lg bg-card">
            <h3 className="text-lg font-medium mb-2">No courses found</h3>
            <p className="text-muted-foreground mb-4">
              {user.role === "admin"
                ? "Start by adding a new course to the system."
                : user.role === "instructor"
                ? "You are not assigned to any courses yet."
                : "You are not enrolled in any courses yet."}
            </p>
            {user.role === "admin" && (
              <Button>Add New Course</Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;
