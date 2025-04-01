
// Types for our application
export interface Course {
  id: string;
  title: string;
  code: string;
  description: string;
  instructorId: string;
  enrolledStudents: string[];
  schedule: {
    day: string;
    startTime: string;
    endTime: string;
  }[];
  createdAt: string;
}

export interface Assignment {
  id: string;
  courseId: string;
  title: string;
  description: string;
  dueDate: string;
  maxScore: number;
  submissions: Submission[];
}

export interface Submission {
  id: string;
  assignmentId: string;
  studentId: string;
  submissionDate: string;
  content: string;
  attachments?: string[];
  score?: number;
  feedback?: string;
}

export interface Discussion {
  id: string;
  courseId: string;
  title: string;
  content: string;
  authorId: string;
  createdAt: string;
  replies: DiscussionReply[];
}

export interface DiscussionReply {
  id: string;
  discussionId: string;
  authorId: string;
  content: string;
  createdAt: string;
}

export interface Attendance {
  id: string;
  courseId: string;
  date: string;
  records: {
    studentId: string;
    status: "present" | "absent" | "late" | "excused";
  }[];
}

// Mock courses
export const courses: Course[] = [
  {
    id: "course1",
    title: "Introduction to Computer Science",
    code: "CS101",
    description: "An introductory course covering the basics of computer science, programming, and problem-solving.",
    instructorId: "2", // Teacher Smith
    enrolledStudents: ["3"], // Student Doe
    schedule: [
      { day: "Monday", startTime: "10:00", endTime: "11:30" },
      { day: "Wednesday", startTime: "10:00", endTime: "11:30" },
    ],
    createdAt: "2023-09-01T08:00:00Z",
  },
  {
    id: "course2",
    title: "Data Structures and Algorithms",
    code: "CS201",
    description: "A comprehensive study of data structures and algorithms, their implementations, and applications.",
    instructorId: "2", // Teacher Smith
    enrolledStudents: ["3"], // Student Doe
    schedule: [
      { day: "Tuesday", startTime: "14:00", endTime: "15:30" },
      { day: "Thursday", startTime: "14:00", endTime: "15:30" },
    ],
    createdAt: "2023-09-02T09:00:00Z",
  },
  {
    id: "course3",
    title: "Database Management Systems",
    code: "CS301",
    description: "A course on database design, implementation, and management principles.",
    instructorId: "2", // Teacher Smith
    enrolledStudents: ["3"], // Student Doe
    schedule: [
      { day: "Monday", startTime: "14:00", endTime: "15:30" },
      { day: "Friday", startTime: "10:00", endTime: "11:30" },
    ],
    createdAt: "2023-09-03T10:00:00Z",
  },
];

// Mock assignments
export const assignments: Assignment[] = [
  {
    id: "assignment1",
    courseId: "course1",
    title: "Variables and Data Types",
    description: "Complete exercises on variables, data types, and basic operations in programming.",
    dueDate: "2023-09-15T23:59:59Z",
    maxScore: 100,
    submissions: []
  },
  {
    id: "assignment2",
    courseId: "course1",
    title: "Control Flow",
    description: "Implement programs using conditional statements and loops.",
    dueDate: "2023-09-22T23:59:59Z",
    maxScore: 100,
    submissions: []
  },
  {
    id: "assignment3",
    courseId: "course2",
    title: "Linked Lists",
    description: "Implement a linked list and its operations.",
    dueDate: "2023-09-20T23:59:59Z",
    maxScore: 100,
    submissions: [
      {
        id: "submission1",
        assignmentId: "assignment3",
        studentId: "3",
        submissionDate: "2023-09-18T14:32:00Z",
        content: "Linked list implementation with insert, delete, and traversal operations.",
        attachments: ["linkedlist.zip"],
        score: 85,
        feedback: "Good implementation, but missing error handling in some cases."
      }
    ]
  },
];

// Mock discussions
export const discussions: Discussion[] = [
  {
    id: "discussion1",
    courseId: "course1",
    title: "Help with Assignment 1",
    content: "I'm struggling with the variables exercise. Can someone explain how to convert between data types?",
    authorId: "3", // Student Doe
    createdAt: "2023-09-10T15:30:00Z",
    replies: [
      {
        id: "reply1",
        discussionId: "discussion1",
        authorId: "2", // Teacher Smith
        content: "Type conversion in most languages can be done explicitly using casting functions or methods. Check the lecture slides from Week 2 for examples.",
        createdAt: "2023-09-10T16:45:00Z",
      }
    ]
  },
  {
    id: "discussion2",
    courseId: "course2",
    title: "Linked List vs. Array",
    content: "What are the advantages of using a linked list over an array?",
    authorId: "3", // Student Doe
    createdAt: "2023-09-16T10:15:00Z",
    replies: []
  },
];

// Mock attendance
export const attendance: Attendance[] = [
  {
    id: "attendance1",
    courseId: "course1",
    date: "2023-09-04", // Monday
    records: [
      {
        studentId: "3", // Student Doe
        status: "present"
      }
    ]
  },
  {
    id: "attendance2",
    courseId: "course1",
    date: "2023-09-06", // Wednesday
    records: [
      {
        studentId: "3", // Student Doe
        status: "present"
      }
    ]
  },
  {
    id: "attendance3",
    courseId: "course1",
    date: "2023-09-11", // Monday
    records: [
      {
        studentId: "3", // Student Doe
        status: "absent"
      }
    ]
  },
  {
    id: "attendance4",
    courseId: "course1",
    date: "2023-09-13", // Wednesday
    records: [
      {
        studentId: "3", // Student Doe
        status: "late"
      }
    ]
  }
];

// Helper function to get courses by user ID based on role
export const getCoursesByUserId = (userId: string, role: string): Course[] => {
  if (role === "admin") {
    return courses; // Admin can see all courses
  } else if (role === "instructor") {
    return courses.filter(course => course.instructorId === userId);
  } else { // student
    return courses.filter(course => course.enrolledStudents.includes(userId));
  }
};

// Helper function to get assignments by course ID
export const getAssignmentsByCourseId = (courseId: string): Assignment[] => {
  return assignments.filter(assignment => assignment.courseId === courseId);
};

// Helper function to get discussions by course ID
export const getDiscussionsByCourseId = (courseId: string): Discussion[] => {
  return discussions.filter(discussion => discussion.courseId === courseId);
};

// Helper function to get attendance by course ID
export const getAttendanceByCourseId = (courseId: string): Attendance[] => {
  return attendance.filter(record => record.courseId === courseId);
};

// Helper function to get attendance by student ID
export const getAttendanceByStudentId = (studentId: string): { course: Course; attendanceRecords: Attendance[] }[] => {
  const studentCourses = courses.filter(course => course.enrolledStudents.includes(studentId));
  
  return studentCourses.map(course => {
    const courseAttendance = attendance.filter(a => a.courseId === course.id);
    return {
      course,
      attendanceRecords: courseAttendance
    };
  });
};

// Calculate attendance percentage
export const calculateAttendancePercentage = (courseId: string, studentId: string): number => {
  const courseAttendance = attendance.filter(a => a.courseId === courseId);
  if (courseAttendance.length === 0) return 0;
  
  const totalClasses = courseAttendance.length;
  const presentClasses = courseAttendance.filter(a => 
    a.records.some(r => r.studentId === studentId && (r.status === "present" || r.status === "late"))
  ).length;
  
  return (presentClasses / totalClasses) * 100;
};
