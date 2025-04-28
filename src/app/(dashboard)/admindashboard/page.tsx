"use client"

import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Users,
  BarChart3,
  FileText,
  Settings as SettingsIcon,
  UserCog,
  Download,
  ShieldCheck,
  AlertTriangle
} from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function AdminDashboardPage() {
  const isLoggedIn = true

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar isLoggedIn={isLoggedIn} />
      <main className="flex-1 py-8">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Admin Dashboard</h1>
              <p className="text-muted-foreground">Welcome back, System Administrator!</p>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <FileText className="mr-2 h-4 w-4" /> Export Report
              </Button>
              <Button size="sm">
                <SettingsIcon className="mr-2 h-4 w-4" /> System Settings
              </Button>
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
                <div className="text-2xl font-bold">{users.length}</div>
                <p className="text-xs text-muted-foreground">All roles</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Reports Generated</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{reports.length}</div>
                <p className="text-xs text-muted-foreground">This month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Skill Gaps</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{skillGaps.length}</div>
                <p className="text-xs text-muted-foreground">Identified</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">System Status</CardTitle>
                <ShieldCheck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">Operational</div>
                <p className="text-xs text-muted-foreground">All systems normal</p>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="users" className="space-y-4">
            <TabsList>
              <TabsTrigger value="users">Manage Users</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="skillgaps">Skill Gaps</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            {/* Manage Users */}
            <TabsContent value="users" className="space-y-4">
              <div className="rounded-lg border">
                <div className="p-4 bg-slate-50 dark:bg-slate-900 flex justify-between items-center">
                  <div>
                    <h3 className="font-medium mb-1">User Management</h3>
                    <p className="text-sm text-muted-foreground">View, edit, and assign roles to users</p>
                  </div>
                  <Button size="sm" variant="outline">
                    <UserCog className="mr-2 h-4 w-4" /> Add User
                  </Button>
                </div>
                <div className="divide-y">
                  {users.map((user, index) => (
                    <div key={index} className="flex flex-col md:flex-row md:items-center justify-between p-4">
                      <div className="mb-3 md:mb-0 flex items-center gap-2">
                        <Users className="h-5 w-5 text-muted-foreground" />
                        <span className="font-medium">{user.name}</span>
                        <Badge variant={getRoleBadge(user.role)}>{user.role}</Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">Edit</Button>
                        <Button variant="default" size="sm">Assign Role</Button>
                        <Button variant="destructive" size="sm">Remove</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Reports */}
            <TabsContent value="reports" className="space-y-4">
              <div className="rounded-lg border">
                <div className="p-4 bg-slate-50 dark:bg-slate-900 flex justify-between items-center">
                  <div>
                    <h3 className="font-medium mb-1">Reports</h3>
                    <p className="text-sm text-muted-foreground">Download or generate new reports</p>
                  </div>
                  <Button size="sm" variant="outline">
                    <Download className="mr-2 h-4 w-4" /> Download All
                  </Button>
                </div>
                <div className="divide-y">
                  {reports.map((report, index) => (
                    <div key={index} className="flex flex-col md:flex-row md:items-center justify-between p-4">
                      <div>
                        <span className="font-medium">{report.title}</span>
                        <p className="text-sm text-muted-foreground">{report.date}</p>
                      </div>
                      <Button variant="outline" size="sm">Download</Button>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Analytics */}
            <TabsContent value="analytics" className="space-y-4">
              <div className="rounded-lg border">
                <div className="p-4 bg-slate-50 dark:bg-slate-900">
                  <h3 className="font-medium mb-1">Analytics Overview</h3>
                  <p className="text-sm text-muted-foreground">Key metrics and charts</p>
                </div>
                <div className="p-4">
                  {/* Replace with real charts as needed */}
                  <div className="flex flex-col md:flex-row gap-4">
                    <Card className="flex-1">
                      <CardHeader>
                        <CardTitle>Training Completion Rate</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <BarChart3 className="w-full h-24 text-primary mb-2" />
                        <div className="text-2xl font-bold">87%</div>
                        <p className="text-xs text-muted-foreground">This quarter</p>
                      </CardContent>
                    </Card>
                    <Card className="flex-1">
                      <CardHeader>
                        <CardTitle>Active Users</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <BarChart3 className="w-full h-24 text-primary mb-2" />
                        <div className="text-2xl font-bold">54</div>
                        <p className="text-xs text-muted-foreground">Logged in this month</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Skill Gaps */}
            <TabsContent value="skillgaps" className="space-y-4">
              <div className="rounded-lg border">
                <div className="p-4 bg-slate-50 dark:bg-slate-900">
                  <h3 className="font-medium mb-1">Skill Gaps</h3>
                  <p className="text-sm text-muted-foreground">Identified gaps among trainees</p>
                </div>
                <div className="divide-y">
                  {skillGaps.map((gap, index) => (
                    <div key={index} className="flex flex-col md:flex-row md:items-center justify-between p-4">
                      <div>
                        <span className="font-medium">{gap.skill}</span>
                        <p className="text-sm text-muted-foreground">{gap.description}</p>
                      </div>
                      <Badge variant="destructive">Gap</Badge>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Settings */}
            <TabsContent value="settings" className="space-y-4">
              <div className="rounded-lg border">
                <div className="p-4 bg-slate-50 dark:bg-slate-900">
                  <h3 className="font-medium mb-1">System Settings</h3>
                  <p className="text-sm text-muted-foreground">Configure system preferences</p>
                </div>
                <div className="p-4">
                  <Button variant="outline" size="sm" className="mr-2">Backup Data</Button>
                  <Button variant="outline" size="sm" className="mr-2">Restore</Button>
                  <Button variant="destructive" size="sm">Reset System</Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}

// Helper for role badge
function getRoleBadge(role: string) {
  switch (role) {
    case "admin":
      return "default"
    case "trainer":
      return "secondary"
    case "trainee":
      return "outline"
    default:
      return "default"
  }
}

// Sample data for users
const users = [
  { name: "Alice Uwimana", role: "trainee" },
  { name: "Eric Niyonsaba", role: "trainer" },
  { name: "Grace Mukamana", role: "trainee" },
  { name: "Jane Admin", role: "admin" }
]

// Sample data for reports
const reports = [
  { title: "Monthly Training Report", date: "June 2025" },
  { title: "Attendance Summary", date: "June 2025" },
  { title: "Skill Gap Analysis", date: "June 2025" }
]

// Sample data for skill gaps
const skillGaps = [
  { skill: "Digital Literacy", description: "Many trainees lack basic digital skills." },
  { skill: "Project Management", description: "Low completion rate in project management courses." }
]