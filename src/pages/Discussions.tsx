
import React from "react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { getCoursesByUserId, discussions } from "@/data/mockData";
import { MessageSquare, Plus, Clock } from "lucide-react";

const Discussions = () => {
  const { user } = useAuth();
  
  if (!user) return null;
  
  const courses = getCoursesByUserId(user.id, user.role);
  
  // Get discussions for all courses the user is enrolled in
  const userDiscussions = discussions.filter(discussion => 
    courses.some(course => course.id === discussion.courseId)
  );
  
  // Format the date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Find the course for a discussion
  const getCourseForDiscussion = (courseId: string) => {
    return courses.find(course => course.id === courseId);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="lms-page-title">Discussions</h1>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Discussion
        </Button>
      </div>
      
      <div className="mb-6">
        <div className="relative">
          <Input 
            placeholder="Search discussions..." 
            className="pl-10"
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
            <MessageSquare className="h-5 w-5" />
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        {userDiscussions.length > 0 ? (
          userDiscussions.map((discussion) => {
            const course = getCourseForDiscussion(discussion.courseId);
            
            return (
              <Card key={discussion.id}>
                <CardHeader>
                  <div className="flex justify-between">
                    <div>
                      <CardTitle>{discussion.title}</CardTitle>
                      <CardDescription>
                        {course ? `${course.title} (${course.code})` : "Unknown Course"}
                      </CardDescription>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="h-4 w-4 mr-1" />
                      {formatDate(discussion.createdAt)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    {discussion.content}
                  </p>
                  <div className="flex items-center">
                    <Badge variant="outline" className="mr-2">
                      {discussion.authorId === user.id ? "Posted by you" : "Posted by Instructor"}
                    </Badge>
                    <Badge>
                      {discussion.replies.length} {discussion.replies.length === 1 ? "reply" : "replies"}
                    </Badge>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    View Discussion
                  </Button>
                </CardFooter>
              </Card>
            );
          })
        ) : (
          <Card>
            <CardContent className="pt-6 text-center">
              <MessageSquare className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
              <p>No discussions found</p>
              <Button className="mt-4">Start a Discussion</Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Discussions;
