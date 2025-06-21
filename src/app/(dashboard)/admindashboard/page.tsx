"use client"

import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Users,
  Building2,
  BookOpen,
  FileText,
  UserPlus,
  Settings
} from "lucide-react"
import { UserManagement } from "@/components/user-management"
import { OrganizationManagement } from "@/components/organization-management"
import { TrainingManagement } from "@/components/training-management"
import { FeedbackManagement } from "@/components/feedback-management"
import { useSelector, useDispatch } from "react-redux"
import type { RootState, AppDispatch } from "@/redux/store"
import { useEffect } from "react"
import { fetchUsers } from "@/redux/api/userApiSlice"
import { fetchOrganizations } from "@/redux/api/organizationApiSlice"
import { fetchTrainings } from "@/redux/api/trainingApiSlice"
import { fetchFeedbacks } from "@/redux/api/feedbackApiSlice"

export default function AdminDashboardPage() {
  const dispatch = useDispatch<AppDispatch>()
  useEffect(() => {
    dispatch(fetchUsers())
    dispatch(fetchOrganizations())
    dispatch(fetchTrainings())
    dispatch(fetchFeedbacks())
  }, [dispatch])

  const userCount = useSelector((state: RootState) => state.users.users.length)
  const orgCount = useSelector((state: RootState) => state.organizations.organizations.length)
  const trainingCount = useSelector((state: RootState) => state.trainings.courses.length)
  const feedbackCount = useSelector((state: RootState) => state.feedback.feedbacks.length)

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 py-8">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Admin Dashboard</h1>
              <p className="text-muted-foreground">Welcome back, Admin!</p>
            </div>
          </div>

          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{userCount}</div>
                <p className="text-xs text-muted-foreground">Active users in the system</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Organizations</CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{orgCount}</div>
                <p className="text-xs text-muted-foreground">Registered organizations</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Active Trainings</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{trainingCount}</div>
                <p className="text-xs text-muted-foreground">Ongoing training sessions</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Feedback</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{feedbackCount}</div>
                <p className="text-xs text-muted-foreground">Feedback entries in the system</p>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="users" className="space-y-4">
            <TabsList>
              <TabsTrigger value="users">User Management</TabsTrigger>
              <TabsTrigger value="organizations">Organizations</TabsTrigger>
              <TabsTrigger value="trainings">Trainings</TabsTrigger>
              <TabsTrigger value="feedback">Feedback</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="users" className="space-y-4">
              <UserManagement />
            </TabsContent>

            <TabsContent value="organizations" className="space-y-4">
              <OrganizationManagement />
            </TabsContent>

            <TabsContent value="trainings" className="space-y-4">
              <TrainingManagement />
            </TabsContent>

            <TabsContent value="feedback" className="space-y-4">
              <FeedbackManagement />
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              <div className="rounded-lg border">
                <div className="p-4 bg-slate-50 dark:bg-slate-900">
                  <h3 className="font-medium mb-1">System Settings</h3>
                  <p className="text-sm text-muted-foreground">Configure system-wide settings and preferences</p>
                </div>
                {/* Settings content will go here */}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}