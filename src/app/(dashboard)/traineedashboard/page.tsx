"use client"

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  BarChart3, 
  BookOpen, 
  Calendar, 
  CheckCircle, 
  Clock, 
  FileText, 
  Award,
  Download
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import OTMSLoader from "@/components/OTMSLoader"

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate data fetching/loading
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <OTMSLoader />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 py-8">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">My Learning Dashboard</h1>
              <p className="text-muted-foreground">Welcome back, John Doe!</p>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Calendar className="mr-2 h-4 w-4" /> View Calendar
              </Button>
              <Button size="sm">
                <BookOpen className="mr-2 h-4 w-4" /> Browse Courses
              </Button>
            </div>
          </div>
          
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Enrolled Courses</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">5</div>
                <p className="text-xs text-muted-foreground">2 in progress, 3 upcoming</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Completed Courses</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">7</div>
                <p className="text-xs text-muted-foreground">3 certificates earned</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">85%</div>
                <p className="text-xs text-muted-foreground">Based on 7 completed courses</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Next Session</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold">Tomorrow, 10:00 AM</div>
                <p className="text-xs text-muted-foreground">Digital Accessibility Training</p>
              </CardContent>
            </Card>
          </div>
          
          {/* Tabs */}
          <Tabs defaultValue="inprogress" className="space-y-4">
            <TabsList>
              <TabsTrigger value="inprogress">In Progress</TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="materials">Learning Materials</TabsTrigger>
            </TabsList>
            
            <TabsContent value="inprogress" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {inProgressCourses.map((course, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle>{course.title}</CardTitle>
                        <Badge variant={getBadgeVariant(course.type)}>{course.type}</Badge>
                      </div>
                      <CardDescription>{course.instructor}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-muted-foreground">Progress:</span>
                        <span className="text-sm font-medium">{course.progress}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full mb-4">
                        <div 
                          className="h-full bg-primary rounded-full" 
                          style={{ width: `${course.progress}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-sm text-muted-foreground">Next Session:</span>
                        <span className="text-sm font-medium">{course.nextSession}</span>
                      </div>
                      <Button variant="default" size="sm" className="w-full">
                        Continue Learning
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="upcoming" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {upcomingCourses.map((course, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle>{course.title}</CardTitle>
                        <Badge variant={getBadgeVariant(course.type)}>{course.type}</Badge>
                      </div>
                      <CardDescription>{course.instructor}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-muted-foreground">Start Date:</span>
                        <span className="text-sm font-medium">{course.startDate}</span>
                      </div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-muted-foreground">Duration:</span>
                        <span className="text-sm font-medium">{course.duration}</span>
                      </div>
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-sm text-muted-foreground">Location:</span>
                        <span className="text-sm font-medium">{course.location}</span>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" className="flex-1">View Details</Button>
                        <Button variant="default" size="sm" className="flex-1">Add to Calendar</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="completed">
              <div className="rounded-lg border">
                {completedCourses.length > 0 ? (
                  <div className="divide-y">
                    {completedCourses.map((course, index) => (
                      <div key={index} className="flex flex-col md:flex-row md:items-center justify-between p-4">
                        <div className="mb-4 md:mb-0">
                          <div className="flex items-center">
                            <h3 className="font-medium">{course.title}</h3>
                            <Badge variant={getBadgeVariant(course.type)} className="ml-2">{course.type}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">Completed: {course.completionDate}</p>
                        </div>
                        <div className="flex items-center flex-wrap gap-2">
                          <span className="text-sm font-medium mr-2">Score: {course.score}%</span>
                          <Button variant="outline" size="sm" className="flex items-center">
                            <Award className="mr-2 h-4 w-4" /> Certificate
                          </Button>
                          <Button variant="ghost" size="sm" className="flex items-center">
                            <FileText className="mr-2 h-4 w-4" /> Feedback
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <p className="text-muted-foreground">You haven't completed any courses yet.</p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="materials">
              <div className="rounded-lg border">
                <div className="p-4 bg-slate-50 dark:bg-slate-900">
                  <h3 className="font-medium mb-1">My Learning Materials</h3>
                  <p className="text-sm text-muted-foreground">Access course materials and resources</p>
                </div>
                <div className="divide-y">
                  {learningMaterials.map((material, index) => (
                    <div key={index} className="flex flex-col md:flex-row md:items-center justify-between p-4">
                      <div className="mb-3 md:mb-0">
                        <h3 className="font-medium">{material.title}</h3>
                        <p className="text-sm text-muted-foreground">{material.course}</p>
                      </div>
                      <div className="flex items-center">
                        <span className="text-sm text-muted-foreground mr-4">{material.type} • {material.size}</span>
                        <Button variant="outline" size="sm" className="flex items-center">
                          <Download className="mr-2 h-4 w-4" /> Download
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          {/* Recommended Courses */}
          <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Recommended for You</h2>
              <Button variant="ghost" size="sm">View All</Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {recommendedCourses.map((course, index) => (
                <Card key={index} className="relative overflow-hidden border dark:border-slate-800 bg-background p-2 dark:bg-slate-900/10 backdrop-blur-sm dark:backdrop-blur-md hover:dark:border-slate-700/50 transition-colors">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle>{course.title}</CardTitle>
                      <Badge variant={getBadgeVariant(course.type)}>{course.type}</Badge>
                    </div>
                    <CardDescription>{course.instructor}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-muted-foreground">Duration:</span>
                      <span className="text-sm font-medium">{course.duration}</span>
                    </div>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-sm text-muted-foreground">Level:</span>
                      <span className="text-sm font-medium">{course.level}</span>
                    </div>
                    <Button variant="outline" size="sm" className="w-full">Learn More</Button>
                  </CardContent>
                  <div className="absolute inset-0 dark:bg-gradient-to-br dark:from-slate-900/80 dark:via-slate-900/20 dark:to-transparent pointer-events-none"></div>
                </Card>
              ))}
            </div>
          </div>
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

// Sample data
const inProgressCourses = [
  {
    title: "Digital Accessibility Training",
    instructor: "Instructor: Sarah Johnson",
    type: "Workshop",
    progress: 65,
    nextSession: "Tomorrow, 10:00 AM"
  },
  {
    title: "Communication Strategies",
    instructor: "Instructor: Michael Ndagijimana",
    type: "Online",
    progress: 30,
    nextSession: "Friday, 2:00 PM"
  }
];

const upcomingCourses = [
  {
    title: "Inclusive Design Principles",
    instructor: "Instructor: David Mugisha",
    type: "Workshop",
    startDate: "June 15, 2025",
    duration: "3 days",
    location: "Conference Room A"
  },
  {
    title: "Project Management Basics",
    instructor: "Instructor: Emma Uwase",
    type: "Online",
    startDate: "June 22, 2025",
    duration: "4 weeks",
    location: "Virtual (Teams)"
  },
  {
    title: "Career Development Workshop",
    instructor: "Instructor: Pierre Hakizimana",
    type: "Workshop",
    startDate: "June 28, 2025",
    duration: "1 day",
    location: "Training Center"
  }
];

const completedCourses = [
  {
    title: "Introduction to Web Accessibility",
    type: "Workshop",
    completionDate: "May 15, 2025",
    score: 92
  },
  {
    title: "Disability Inclusion Training",
    type: "Online",
    completionDate: "April 22, 2025",
    score: 88
  },
  {
    title: "Assistive Technology Workshop",
    type: "Workshop",
    completionDate: "March 10, 2025",
    score: 95
  }
];

const learningMaterials = [
  {
    title: "Web Accessibility Guidelines Handbook",
    course: "Introduction to Web Accessibility",
    type: "PDF",
    size: "2.5 MB"
  },
  {
    title: "Communication Strategies Slides",
    course: "Communication Strategies",
    type: "PowerPoint",
    size: "5.1 MB"
  },
  {
    title: "Assistive Technology Demo Videos",
    course: "Assistive Technology Workshop",
    type: "Video",
    size: "45 MB"
  },
  {
    title: "Disability Inclusion Best Practices",
    course: "Disability Inclusion Training",
    type: "PDF",
    size: "1.8 MB"
  }
];

const recommendedCourses = [
  {
    title: "Leadership Skills for OPD Professionals",
    instructor: "Instructor: Jean Bizimana",
    type: "Workshop",
    duration: "2 days",
    level: "Intermediate"
  },
  {
    title: "Digital Marketing for Non-profits",
    instructor: "Instructor: Marie Mukamana",
    type: "Online",
    duration: "3 weeks",
    level: "Beginner"
  },
  {
    title: "Grant Writing Essentials",
    instructor: "Instructor: Paul Nkusi",
    type: "Self-paced",
    duration: "4 weeks",
    level: "Advanced"
  }
];