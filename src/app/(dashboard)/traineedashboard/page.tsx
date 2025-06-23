"use client"

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/redux/store";
import { fetchTrainings, type Course } from "@/redux/api/trainingApiSlice";
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
  Download,
  Info,
  MapPin
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import OTMSLoader from "@/components/OTMSLoader"
import TrainingDetailsModal from "@/components/TrainingDetailsModal";

export default function DashboardPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { courses, loading } = useSelector((state: RootState) => state.trainings);
  const [selectedTraining, setSelectedTraining] = useState<any | null>(null);
  const [showBrowseModal, setShowBrowseModal] = useState(false);
  const [showCalendarModal, setShowCalendarModal] = useState(false);

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

  const renderTrainingCard = (course: Course) => {
    const startDate = new Date(course.startDate);
    const day = startDate.getDate();
    const month = startDate.toLocaleString('default', { month: 'short' });
    const weekday = startDate.toLocaleString('default', { weekday: 'short' });
    return (
      <div
        key={course._id}
        className="relative rounded-2xl overflow-hidden shadow-lg cursor-pointer group min-h-[320px] flex flex-col justify-end"
        style={{ border: "1px solid #e5e7eb" }}
        onClick={() => setSelectedTraining(course)}
      >
        {/* Background Image */}
        {course.thumbnail?.url && (
          <img
            src={course.thumbnail.url}
            alt={course.title}
            className="absolute inset-0 w-full h-full object-cover z-0 group-hover:scale-105 transition-transform"
          />
        )}
        {/* Date Box */}
        <div className="absolute top-4 left-4 bg-background/90 dark:bg-slate-900/90 rounded-lg shadow px-3 py-2 flex flex-col items-center z-10 border border-border/50">
          <span className="text-xs font-semibold text-muted-foreground">{weekday}</span>
          <span className="text-2xl font-bold text-foreground leading-none">{day}</span>
          <span className="text-xs text-muted-foreground">{month}</span>
        </div>
        {/* Info Icon */}
        <div className="absolute top-4 right-4 z-10">
          <div className="bg-background/90 dark:bg-slate-900/90 rounded-full p-1.5 flex items-center justify-center shadow border border-border/50">
            <Info className="w-4 h-4 text-muted-foreground" />
          </div>
        </div>
        {/* Card Content */}
        <div className="relative z-10 p-6 flex flex-col justify-end min-h-[180px]">
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="w-5 h-5 text-white drop-shadow" />
            <span className="uppercase text-xs font-semibold tracking-wider text-white drop-shadow">{course.location || "Dubai"}</span>
          </div>
          <h2 className="text-2xl font-bold text-white drop-shadow mb-2">{course.title}</h2>
          <Button
            className="mt-4 w-full font-semibold text-base py-2 rounded-xl bg-background/90 dark:bg-slate-900/90 text-foreground hover:bg-background dark:hover:bg-slate-900 border border-border/50"
            onClick={e => { e.stopPropagation(); setSelectedTraining(course); }}
          >
            Enroll Now
          </Button>
        </div>
      </div>
    );
  };

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
              <Button variant="outline" size="sm" onClick={() => setShowCalendarModal(true)}>
                <Calendar className="mr-2 h-4 w-4" /> View Calendar
              </Button>
              <Button size="sm" onClick={() => setShowBrowseModal(true)}>
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
                <div className="text-2xl font-bold">3</div>
                <p className="text-xs text-muted-foreground">0 certificates earned</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">70%</div>
                <p className="text-xs text-muted-foreground">Based on 3 completed courses</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Next Session</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold">Tomorrow, 8:00 AM</div>
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
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {courses.filter(t => t.status === "scheduled").map(renderTrainingCard)}
              </div>
            </TabsContent>
            
            <TabsContent value="scheduled" className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {courses.filter(t => t.status === "scheduled").map(renderTrainingCard)}
              </div>
            </TabsContent>
            
            <TabsContent value="completed" className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {courses.filter(t => t.status === "completed").map(renderTrainingCard)}
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
              {courses.map((course, index) => (
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
        {/* Modal for training details */}
        {selectedTraining && (
          <TrainingDetailsModal
            training={selectedTraining}
            onClose={() => setSelectedTraining(null)}
          />
        )}
        {/* Browse Trainings Sidebar Modal */}
        {showBrowseModal && (
          <div className="fixed inset-0 z-50 flex">
            <div className="flex-1 bg-black/40" onClick={() => setShowBrowseModal(false)} />
            <div className="relative w-full max-w-md h-full bg-white dark:bg-slate-900 shadow-2xl p-6 flex flex-col animate-slide-in-right overflow-y-auto">
              <button className="absolute top-4 right-4 text-2xl text-gray-400 hover:text-gray-700 dark:hover:text-white" onClick={() => setShowBrowseModal(false)}>&times;</button>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><BookOpen className="w-6 h-6 text-primary" /> All Trainings</h2>
              <div className="flex flex-col gap-4">
                {courses.map((course) => (
                  <div
                    key={course._id}
                    className="relative rounded-xl overflow-hidden shadow group cursor-pointer bg-gradient-to-br from-primary/10 to-white dark:from-primary/20 dark:to-slate-900 border border-gray-200 dark:border-slate-800 hover:scale-[1.01] transition"
                    onClick={() => { setSelectedTraining(course); setShowBrowseModal(false); }}
                  >
                    {course.thumbnail?.url && (
                      <img
                        src={course.thumbnail.url}
                        alt={course.title}
                        className="absolute inset-0 w-full h-full object-cover group-hover:opacity-80 transition"
                      />
                    )}
                    <div className="relative z-10 p-4 flex flex-col gap-1">
                      <div className="flex items-center gap-2 mb-1">
                        <MapPin className="w-4 h-4 text-primary" />
                        <span className="text-xs font-semibold uppercase tracking-wider text-primary">{course.location || "Location"}</span>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 truncate">{course.title}</h3>
                      <div className="text-xs text-muted-foreground truncate">{course.instructor?.firstName} {course.instructor?.lastName}</div>
                      <div className="flex items-center gap-2 mt-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{new Date(course.startDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        {/* Calendar Modal (Placeholder) */}
        {showCalendarModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-8 animate-fade-in border border-black/10 dark:border-white/10">
              <button className="absolute top-4 right-4 text-2xl text-gray-400 hover:text-gray-700 dark:hover:text-white" onClick={() => setShowCalendarModal(false)}>&times;</button>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><Calendar className="w-6 h-6 text-primary" /> Training Calendar</h2>
              <div className="flex items-center justify-center h-64 text-muted-foreground">
                {/* Placeholder for calendar component */}
                <span>Calendar with highlighted training start dates coming soon...</span>
              </div>
            </div>
          </div>
        )}
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