"use client"

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '@/redux/store';
import { fetchDashboardMetrics } from '@/redux/api/analyticsApiSlice';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MetricsCards } from './MetricsCards';
import { TrendsCharts } from './TrendsCharts';
import { CertificateAnalytics } from './CertificateAnalytics';
import { AttendanceAnalytics } from './AttendanceAnalytics';
import { DisabilityAnalytics } from './DisabilityAnalytics';
import { ExportPanel } from './ExportPanel';
import { 
  BarChart3, 
  TrendingUp, 
  Award, 
  Users, 
  Accessibility, 
  FileText,
  Download,
  Activity
} from 'lucide-react';

export const AnalyticsDashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, dashboardMetrics } = useSelector((state: RootState) => state.analytics);

  useEffect(() => {
    dispatch(fetchDashboardMetrics());
  }, [dispatch]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        {/* <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            Comprehensive insights into your training program performance
          </p>
        </div> */}
        <div className="flex items-center space-x-2">
          <Activity className="w-5 h-5 text-blue-500" />
          <span className="text-sm text-muted-foreground">
            {loading ? 'Loading...' : 'Real-time data'}
          </span>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="overview" className="flex items-center space-x-2">
            <BarChart3 className="w-4 h-4" />
            <span>Overview</span>
          </TabsTrigger>
          <TabsTrigger value="trends" className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4" />
            <span>Trends</span>
          </TabsTrigger>
          <TabsTrigger value="certificates" className="flex items-center space-x-2">
            <Award className="w-4 h-4" />
            <span>Certificates</span>
          </TabsTrigger>
          <TabsTrigger value="attendance" className="flex items-center space-x-2">
            <Users className="w-4 h-4" />
            <span>Attendance</span>
          </TabsTrigger>
          <TabsTrigger value="disability" className="flex items-center space-x-2">
            <Accessibility className="w-4 h-4" />
            <span>Disability</span>
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center space-x-2">
            <FileText className="w-4 h-4" />
            <span>Reports</span>
          </TabsTrigger>
          <TabsTrigger value="exports" className="flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Exports</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <MetricsCards />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">New Users This Month</span>
                    <span className="text-sm text-muted-foreground">
                      {dashboardMetrics?.recentActivity?.newUsersThisMonth?.toLocaleString() || '0'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">New Trainings This Month</span>
                    <span className="text-sm text-muted-foreground">
                      {dashboardMetrics?.recentActivity?.newCoursesThisMonth?.toLocaleString() || '0'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">New Enrollments This Month</span>
                    <span className="text-sm text-muted-foreground">
                      {dashboardMetrics?.recentActivity?.newEnrollmentsThisMonth?.toLocaleString() || '0'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Rating Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Overall Rating</span>
                    <span className="text-sm text-muted-foreground">
                      {dashboardMetrics?.ratings?.overall?.toFixed(1) || '0.0'} / 5.0
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Content Rating</span>
                    <span className="text-sm text-muted-foreground">
                      {dashboardMetrics?.ratings?.content?.toFixed(1) || '0.0'} / 5.0
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Instructor Rating</span>
                    <span className="text-sm text-muted-foreground">
                      {dashboardMetrics?.ratings?.instructor?.toFixed(1) || '0.0'} / 5.0
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <TrendsCharts />
        </TabsContent>

        <TabsContent value="certificates" className="space-y-6">
          <CertificateAnalytics />
        </TabsContent>

        <TabsContent value="attendance" className="space-y-6">
          <AttendanceAnalytics />
        </TabsContent>

        <TabsContent value="disability" className="space-y-6">
          <DisabilityAnalytics />
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Report Generation</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Generate comprehensive reports for your training program analytics.
              </p>
              <ExportPanel />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="exports" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Data Export</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Export your analytics data in various formats for external analysis.
              </p>
              <ExportPanel />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}; 