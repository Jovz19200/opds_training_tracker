"use client"

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/redux/store";
import { fetchTrainings } from "@/redux/api/trainingApiSlice";
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
  const dispatch = useDispatch<AppDispatch>();
  const { trainings, loading } = useSelector((state: RootState) => state.trainings);

  useEffect(() => {
    dispatch(fetchTrainings());
  }, [dispatch]);

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
              <p className="text-muted-foreground">Welcome back!</p>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Calendar className="mr-2 h-4 w-4" /> View Calendar
              </Button>
              <Button size="sm">
                <BookOpen className="mr-2 h-4 w-4" /> Browse Trainings
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
          <Tabs defaultValue="upcoming" className="space-y-4">
            <TabsList>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
            
            <TabsContent value="upcoming" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {trainings.filter(t => t.status === "scheduled").map((training, index) => (
                  <Card key={training._id || index}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle>{training.title}</CardTitle>
                        {training.thumbnail?.url && (
                          <img src={training.thumbnail.url} alt={training.title} className="h-12 w-12 object-cover rounded" />
                        )}
                      </div>
                      <CardDescription>{training.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-2 text-sm text-muted-foreground">
                        <span className="font-medium">Instructor:</span> {training.instructor?.firstName} {training.instructor?.lastName}
                      </div>
                      <div className="mb-2 text-sm text-muted-foreground">
                        <span className="font-medium">Start:</span> {new Date(training.startDate).toLocaleString()}
                      </div>
                      <div className="mb-2 text-sm text-muted-foreground">
                        <span className="font-medium">End:</span> {new Date(training.endDate).toLocaleString()}
                      </div>
                      <div className="mb-2 text-sm text-muted-foreground">
                        <span className="font-medium">Location:</span> {training.isVirtual ? (
                          <a href={training.virtualMeetingLink} target="_blank" rel="noopener noreferrer" className="text-primary underline">Virtual Link</a>
                        ) : (
                          training.location
                        )}
                      </div>
                      <div className="mb-2 text-sm text-muted-foreground">
                        <span className="font-medium">Capacity:</span> {training.capacity}
                      </div>
                      <div className="mb-2 text-sm text-muted-foreground">
                        <span className="font-medium">Accessibility:</span> {training.accessibilityFeatures?.join(", ") || "None"}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="scheduled" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {trainings.filter(t => t.status === "scheduled").map((training, index) => (
                  <Card key={training._id || index}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle>{training.title}</CardTitle>
                        {training.thumbnail?.url && (
                          <img src={training.thumbnail.url} alt={training.title} className="h-12 w-12 object-cover rounded" />
                        )}
                      </div>
                      <CardDescription>{training.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-2 text-sm text-muted-foreground">
                        <span className="font-medium">Instructor:</span> {training.instructor?.firstName} {training.instructor?.lastName}
                      </div>
                      <div className="mb-2 text-sm text-muted-foreground">
                        <span className="font-medium">Start:</span> {new Date(training.startDate).toLocaleString()}
                      </div>
                      <div className="mb-2 text-sm text-muted-foreground">
                        <span className="font-medium">End:</span> {new Date(training.endDate).toLocaleString()}
                      </div>
                      <div className="mb-2 text-sm text-muted-foreground">
                        <span className="font-medium">Location:</span> {training.isVirtual ? (
                          <a href={training.virtualMeetingLink} target="_blank" rel="noopener noreferrer" className="text-primary underline">Virtual Link</a>
                        ) : (
                          training.location
                        )}
                      </div>
                      <div className="mb-2 text-sm text-muted-foreground">
                        <span className="font-medium">Capacity:</span> {training.capacity}
                      </div>
                      <div className="mb-2 text-sm text-muted-foreground">
                        <span className="font-medium">Accessibility:</span> {training.accessibilityFeatures?.join(", ") || "None"}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="completed" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {trainings.filter(t => t.status === "completed").map((training, index) => (
                  <Card key={training._id || index}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle>{training.title}</CardTitle>
                        {training.thumbnail?.url && (
                          <img src={training.thumbnail.url} alt={training.title} className="h-12 w-12 object-cover rounded" />
                        )}
                      </div>
                      <CardDescription>{training.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-2 text-sm text-muted-foreground">
                        <span className="font-medium">Instructor:</span> {training.instructor?.firstName} {training.instructor?.lastName}
                      </div>
                      <div className="mb-2 text-sm text-muted-foreground">
                        <span className="font-medium">Start:</span> {new Date(training.startDate).toLocaleString()}
                      </div>
                      <div className="mb-2 text-sm text-muted-foreground">
                        <span className="font-medium">End:</span> {new Date(training.endDate).toLocaleString()}
                      </div>
                      <div className="mb-2 text-sm text-muted-foreground">
                        <span className="font-medium">Location:</span> {training.isVirtual ? (
                          <a href={training.virtualMeetingLink} target="_blank" rel="noopener noreferrer" className="text-primary underline">Virtual Link</a>
                        ) : (
                          training.location
                        )}
                      </div>
                      <div className="mb-2 text-sm text-muted-foreground">
                        <span className="font-medium">Capacity:</span> {training.capacity}
                      </div>
                      <div className="mb-2 text-sm text-muted-foreground">
                        <span className="font-medium">Accessibility:</span> {training.accessibilityFeatures?.join(", ") || "None"}
                      </div>
                    </CardContent>
                  </Card>
                ))}
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
              {trainings.map((course, index) => (
                <Card key={index} className="relative overflow-hidden border dark:border-slate-800 bg-background p-2 dark:bg-slate-900/10 backdrop-blur-sm dark:backdrop-blur-md hover:dark:border-slate-700/50 transition-colors">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle>{course.title}</CardTitle>
                      <Badge variant={getBadgeVariant(course.title)}>{course.title}</Badge>
                    </div>
                    <CardDescription>{course.instructor.firstName}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-muted-foreground">Duration:</span>
                      <span className="text-sm font-medium">{course.duration}</span>
                    </div>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-sm text-muted-foreground">Level:</span>
                      <span className="text-sm font-medium">{course.status}</span>
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