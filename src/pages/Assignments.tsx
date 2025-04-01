
import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getCoursesByUserId, getAssignmentsByCourseId } from "@/data/mockData";
import { FileText, Upload, CheckCircle2, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const Assignments = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("upcoming");
  
  if (!user) return null;
  
  const courses = getCoursesByUserId(user.id, user.role);
  
  // Get all assignments across all courses
  const allAssignments = courses.flatMap(course => {
    const courseAssignments = getAssignmentsByCourseId(course.id);
    return courseAssignments.map(assignment => ({
      ...assignment,
      course,
    }));
  });
  
  // Split assignments into categories
  const currentDate = new Date();
  
  const upcomingAssignments = allAssignments
    .filter(assignment => new Date(assignment.dueDate) > currentDate)
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  
  const pastAssignments = allAssignments
    .filter(assignment => new Date(assignment.dueDate) <= currentDate)
    .sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime());
  
  // For students, we need to check which assignments they've submitted
  const submittedAssignments = user.role === "student"
    ? allAssignments.filter(assignment => 
        assignment.submissions.some(submission => submission.studentId === user.id)
      )
    : [];
  
  const pendingAssignments = user.role === "student"
    ? upcomingAssignments.filter(assignment => 
        !assignment.submissions.some(submission => submission.studentId === user.id)
      )
    : [];
  
  // For instructors, we need pending submissions to grade
  const pendingGrading = user.role === "instructor"
    ? allAssignments.flatMap(assignment => 
        assignment.submissions
          .filter(submission => submission.score === undefined)
          .map(submission => ({ ...submission, assignment }))
      )
    : [];
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="lms-page-title">Assignments</h1>
        {user.role === "instructor" && (
          <Button>Create Assignment</Button>
        )}
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 lg:w-auto">
          <TabsTrigger value="upcoming">
            Upcoming
            {pendingAssignments.length > 0 && user.role === "student" && (
              <Badge variant="outline" className="ml-2">
                {pendingAssignments.length}
              </Badge>
            )}
          </TabsTrigger>
          
          <TabsTrigger value="submitted">
            {user.role === "student" ? "Submitted" : "To Grade"}
            {((user.role === "student" && submittedAssignments.length > 0) || 
              (user.role === "instructor" && pendingGrading.length > 0)) && (
              <Badge variant="outline" className="ml-2">
                {user.role === "student" ? submittedAssignments.length : pendingGrading.length}
              </Badge>
            )}
          </TabsTrigger>
          
          <TabsTrigger value="past">Past</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upcoming" className="space-y-4">
          {upcomingAssignments.length > 0 ? (
            upcomingAssignments.map((assignment) => (
              <Card key={assignment.id}>
                <CardHeader>
                  <div className="flex justify-between">
                    <div>
                      <CardTitle>{assignment.title}</CardTitle>
                      <CardDescription>
                        {assignment.course.title} ({assignment.course.code})
                      </CardDescription>
                    </div>
                    <div className="text-sm">
                      Due: {new Date(assignment.dueDate).toLocaleDateString()}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    {assignment.description}
                  </p>
                  {user.role === "student" && (
                    <div className="flex items-center">
                      <Badge 
                        variant={
                          assignment.submissions.some(s => s.studentId === user.id)
                            ? "outline"
                            : "secondary"
                        }
                        className="mr-2"
                      >
                        {assignment.submissions.some(s => s.studentId === user.id)
                          ? "Submitted"
                          : "Not Submitted"
                        }
                      </Badge>
                      {assignment.submissions.some(s => s.studentId === user.id) && (
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      )}
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="outline" 
                    className="w-full"
                  >
                    {user.role === "student" 
                      ? (
                        assignment.submissions.some(s => s.studentId === user.id)
                          ? "Update Submission"
                          : "Submit Assignment"
                      )
                      : "View Details"
                    }
                  </Button>
                </CardFooter>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="pt-6 text-center">
                <FileText className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                <p>No upcoming assignments</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="submitted" className="space-y-4">
          {user.role === "student" ? (
            // Student view - submitted assignments
            submittedAssignments.length > 0 ? (
              submittedAssignments.map((assignment) => {
                const studentSubmission = assignment.submissions.find(
                  s => s.studentId === user.id
                );
                
                return (
                  <Card key={assignment.id}>
                    <CardHeader>
                      <div className="flex justify-between">
                        <div>
                          <CardTitle>{assignment.title}</CardTitle>
                          <CardDescription>
                            {assignment.course.title} ({assignment.course.code})
                          </CardDescription>
                        </div>
                        <div className="text-sm">
                          Submitted: {studentSubmission ? new Date(studentSubmission.submissionDate).toLocaleDateString() : "N/A"}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <Badge variant="outline" className="mr-2">Status</Badge>
                          {studentSubmission?.score !== undefined ? (
                            <span className="text-green-500 flex items-center">
                              <CheckCircle2 className="h-4 w-4 mr-1" />
                              Graded
                            </span>
                          ) : (
                            <span className="text-amber-500 flex items-center">
                              <AlertCircle className="h-4 w-4 mr-1" />
                              Pending Review
                            </span>
                          )}
                        </div>
                        
                        {studentSubmission?.score !== undefined && (
                          <div className="flex items-center">
                            <Badge variant="outline" className="mr-2">Score</Badge>
                            <span>{studentSubmission.score} / {assignment.maxScore}</span>
                          </div>
                        )}
                        
                        {studentSubmission?.feedback && (
                          <div>
                            <Badge variant="outline" className="mb-1">Feedback</Badge>
                            <p className="text-sm text-muted-foreground pl-1">
                              {studentSubmission.feedback}
                            </p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full">
                        View Submission
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })
            ) : (
              <Card>
                <CardContent className="pt-6 text-center">
                  <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                  <p>You haven't submitted any assignments yet</p>
                </CardContent>
              </Card>
            )
          ) : (
            // Instructor view - pending grading
            pendingGrading.length > 0 ? (
              pendingGrading.map((submission) => (
                <Card key={submission.id}>
                  <CardHeader>
                    <div className="flex justify-between">
                      <div>
                        <CardTitle>{submission.assignment.title}</CardTitle>
                        <CardDescription>
                          {submission.assignment.course.title} ({submission.assignment.course.code})
                        </CardDescription>
                      </div>
                      <div className="text-sm">
                        Submitted: {new Date(submission.submissionDate).toLocaleDateString()}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-2">
                      <span className="font-medium">Student: </span>
                      Student Doe
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {submission.content}
                    </p>
                    {submission.attachments && submission.attachments.length > 0 && (
                      <div className="mt-2">
                        <Badge variant="outline">Attachments</Badge>
                        <div className="mt-1">
                          {submission.attachments.map((attachment, i) => (
                            <span 
                              key={i} 
                              className="text-sm text-primary hover:underline cursor-pointer mr-2"
                            >
                              {attachment}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full">
                      Grade Submission
                    </Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="pt-6 text-center">
                  <CheckCircle2 className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                  <p>No submissions pending grading</p>
                </CardContent>
              </Card>
            )
          )}
        </TabsContent>
        
        <TabsContent value="past" className="space-y-4">
          {pastAssignments.length > 0 ? (
            pastAssignments.map((assignment) => {
              const studentSubmission = user.role === "student" 
                ? assignment.submissions.find(s => s.studentId === user.id)
                : null;
              
              return (
                <Card key={assignment.id}>
                  <CardHeader>
                    <div className="flex justify-between">
                      <div>
                        <CardTitle>{assignment.title}</CardTitle>
                        <CardDescription>
                          {assignment.course.title} ({assignment.course.code})
                        </CardDescription>
                      </div>
                      <div className="text-sm">
                        Due: {new Date(assignment.dueDate).toLocaleDateString()}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-2">
                      {assignment.description}
                    </p>
                    
                    {user.role === "student" && (
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <Badge 
                            variant={studentSubmission ? "outline" : "secondary"}
                            className="mr-2"
                          >
                            {studentSubmission ? "Submitted" : "Not Submitted"}
                          </Badge>
                          {studentSubmission ? (
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                          ) : (
                            <AlertCircle className="h-4 w-4 text-red-500" />
                          )}
                        </div>
                        
                        {studentSubmission?.score !== undefined && (
                          <div className="flex items-center">
                            <Badge variant="outline" className="mr-2">Score</Badge>
                            <span>{studentSubmission.score} / {assignment.maxScore}</span>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {user.role === "instructor" && (
                      <div className="flex items-center">
                        <Badge variant="outline" className="mr-2">Submissions</Badge>
                        <span>{assignment.submissions.length} / {assignment.course.enrolledStudents.length}</span>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      {user.role === "student" 
                        ? (studentSubmission ? "View Submission" : "Assignment Closed")
                        : "View Details"
                      }
                    </Button>
                  </CardFooter>
                </Card>
              );
            })
          ) : (
            <Card>
              <CardContent className="pt-6 text-center">
                <FileText className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                <p>No past assignments</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Assignments;
