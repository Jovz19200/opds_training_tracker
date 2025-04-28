"use client"

import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BookOpen,
  Calendar,
  Users,
  ClipboardList,
  Edit,
  Eye,
  User,
  FileText
} from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function TrainerDashboardPage() {
  const isLoggedIn = true

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar isLoggedIn={isLoggedIn} />
      <main className="flex-1 py-8">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Trainer Dashboard</h1>
              <p className="text-muted-foreground">Welcome back, Jane Trainer!</p>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Calendar className="mr-2 h-4 w-4" /> View Calendar
              </Button>
              <Button size="sm">
                <BookOpen className="mr-2 h-4 w-4" /> Create Training
              </Button>
            </div>
          </div>

          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Active Trainings</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{trainings.length}</div>
                <p className="text-xs text-muted-foreground">Ongoing sessions</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Trainees</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{trainees.length}</div>
                <p className="text-xs text-muted-foreground">Enrolled in your trainings</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Upcoming Sessions</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{upcomingSessions.length}</div>
                <p className="text-xs text-muted-foreground">Scheduled this week</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Feedback Received</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{feedbacks.length}</div>
                <p className="text-xs text-muted-foreground">From trainees</p>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="trainings" className="space-y-4">
            <TabsList>
              <TabsTrigger value="trainings">Manage Trainings</TabsTrigger>
              <TabsTrigger value="attendance">Attendance</TabsTrigger>
              <TabsTrigger value="trainees">Trainee Data</TabsTrigger>
              <TabsTrigger value="feedback">Feedback</TabsTrigger>
            </TabsList>

            {/* Manage Trainings */}
            <TabsContent value="trainings" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {trainings.map((training, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle>{training.title}</CardTitle>
                        <Badge variant={getBadgeVariant(training.type)}>{training.type}</Badge>
                      </div>
                      <CardDescription>{training.date} • {training.location}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-muted-foreground">Enrolled:</span>
                        <span className="text-sm font-medium">{training.enrolled}</span>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Edit className="mr-2 h-4 w-4" /> Edit
                        </Button>
                        <Button variant="default" size="sm" className="flex-1">
                          <Eye className="mr-2 h-4 w-4" /> View
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Attendance */}
            <TabsContent value="attendance" className="space-y-4">
              <div className="rounded-lg border">
                <div className="p-4 bg-slate-50 dark:bg-slate-900">
                  <h3 className="font-medium mb-1">Attendance Records</h3>
                  <p className="text-sm text-muted-foreground">Mark or review attendance for your sessions</p>
                </div>
                <div className="divide-y">
                  {attendanceRecords.map((record, index) => (
                    <div key={index} className="flex flex-col md:flex-row md:items-center justify-between p-4">
                      <div className="mb-3 md:mb-0">
                        <h3 className="font-medium">{record.session}</h3>
                        <p className="text-sm text-muted-foreground">{record.date} • {record.location}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Present: {record.present}</span>
                        <span className="text-sm text-muted-foreground">Absent: {record.absent}</span>
                        <Button variant="outline" size="sm">Mark Attendance</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Trainee Data */}
            <TabsContent value="trainees" className="space-y-4">
              <div className="rounded-lg border">
                <div className="p-4 bg-slate-50 dark:bg-slate-900">
                  <h3 className="font-medium mb-1">Trainee List</h3>
                  <p className="text-sm text-muted-foreground">View progress and details of your trainees</p>
                </div>
                <div className="divide-y">
                  {trainees.map((trainee, index) => (
                    <div key={index} className="flex flex-col md:flex-row md:items-center justify-between p-4">
                      <div className="mb-3 md:mb-0 flex items-center gap-2">
                        <User className="h-5 w-5 text-muted-foreground" />
                        <span className="font-medium">{trainee.name}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-muted-foreground">Progress: {trainee.progress}%</span>
                        <Badge variant={trainee.status === "Active" ? "default" : "secondary"}>{trainee.status}</Badge>
                        <Button variant="outline" size="sm">View Details</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Feedback */}
            <TabsContent value="feedback" className="space-y-4">
              <div className="rounded-lg border">
                <div className="p-4 bg-slate-50 dark:bg-slate-900">
                  <h3 className="font-medium mb-1">Trainee Feedback</h3>
                  <p className="text-sm text-muted-foreground">See what your trainees are saying</p>
                </div>
                <div className="divide-y">
                  {feedbacks.map((feedback, index) => (
                    <div key={index} className="flex flex-col md:flex-row md:items-center justify-between p-4">
                      <div className="mb-3 md:mb-0">
                        <span className="font-medium">{feedback.trainee}</span>
                        <p className="text-sm text-muted-foreground">{feedback.course}</p>
                      </div>
                      <div className="flex flex-col md:flex-row md:items-center gap-2">
                        <span className="text-sm">{feedback.comment}</span>
                        <Badge variant={feedback.rating > 3 ? "default" : "destructive"}>Rating: {feedback.rating}/5</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}

// Helper function for badge variants
function getBadgeVariant(type: string) {
  switch (type) {
    case "Workshop":
      return "default";
    case "Online":
      return "secondary";
    case "Self-paced":
      return "outline";
    case "Webinar":
      return "destructive";
    default:
      return "default";
  }
}

// Sample data for trainings
const trainings = [
  {
    title: "Digital Accessibility Training",
    type: "Workshop",
    date: "June 10, 2025",
    location: "Conference Room A",
    enrolled: 18
  },
  {
    title: "Communication Strategies",
    type: "Online",
    date: "June 12, 2025",
    location: "Virtual (Teams)",
    enrolled: 25
  }
];

// Sample data for attendance
const attendanceRecords = [
  {
    session: "Digital Accessibility Training - Day 1",
    date: "June 10, 2025",
    location: "Conference Room A",
    present: 16,
    absent: 2
  },
  {
    session: "Communication Strategies - Session 1",
    date: "June 12, 2025",
    location: "Virtual (Teams)",
    present: 23,
    absent: 2
  }
];

// Sample data for trainees
const trainees = [
  {
    name: "Alice Uwimana",
    progress: 80,
    status: "Active"
  },
  {
    name: "Eric Niyonsaba",
    progress: 60,
    status: "Active"
  },
  {
    name: "Grace Mukamana",
    progress: 100,
    status: "Completed"
  }
];

// Sample data for feedback
const feedbacks = [
  {
    trainee: "Alice Uwimana",
    course: "Digital Accessibility Training",
    comment: "Very informative and practical.",
    rating: 5
  },
  {
    trainee: "Eric Niyonsaba",
    course: "Communication Strategies",
    comment: "Great session, but could use more examples.",
    rating: 4
  },
  {
    trainee: "Grace Mukamana",
    course: "Digital Accessibility Training",
    comment: "Loved the hands-on activities.",
    rating: 5
  }
];

// Sample data for upcoming sessions
const upcomingSessions = [
  {
    title: "Digital Accessibility Training - Day 2",
    date: "June 11, 2025"
  },
  {
    title: "Communication Strategies - Session 2",
    date: "June 13, 2025"
  }
];
