"use client"

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '@/redux/store';
import { 
  fetchEnrollmentTrends, 
  fetchFeedbackTrends, 
  fetchUserGrowth,
  fetchCompletionRates,
  fetchCoursePerformance
} from '@/redux/api/analyticsApiSlice';
import { SimpleChart } from './SimpleChart';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export const TrendsCharts: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    enrollmentTrends,
    feedbackTrends,
    userGrowth,
    completionRates,
    coursePerformance,
    loading
  } = useSelector((state: RootState) => state.analytics);

  useEffect(() => {
    dispatch(fetchEnrollmentTrends({}));
    dispatch(fetchFeedbackTrends({}));
    dispatch(fetchUserGrowth({}));
    dispatch(fetchCompletionRates({}));
    dispatch(fetchCoursePerformance({}));
  }, [dispatch]);

  const getTrendIcon = (change?: number) => {
    if (!change) return <Minus className="w-4 h-4" />;
    return change > 0 ? 
      <TrendingUp className="w-4 h-4 text-green-500" /> : 
      <TrendingDown className="w-4 h-4 text-red-500" />;
  };

  const getTrendBadge = (change?: number) => {
    if (!change) return null;
    return (
      <Badge variant={change > 0 ? "default" : "destructive"} className="ml-2">
        {change > 0 ? '+' : ''}{change}%
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(4)].map((_, index) => (
          <Card key={index} className="animate-pulse">
            <CardHeader>
              <div className="h-6 bg-gray-200 rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-48 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Enrollment Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SimpleChart
          title="Enrollment Trends"
          data={
            enrollmentTrends?.map(item => ({
              label: item.period,
              value: item.enrollments
            })) || []
          }
          type="line"
          height={200}
        />
        <SimpleChart
          title="Completion vs Dropout Rates"
          data={
            enrollmentTrends && enrollmentTrends.length > 0 ? [
              {
                label: 'Completed',
                value: enrollmentTrends.reduce((sum, item) => sum + item.completed, 0)
              },
              {
                label: 'Dropped',
                value: enrollmentTrends.reduce((sum, item) => sum + item.dropped, 0)
              }
            ] : []
          }
          type="pie"
        />
      </div>

      {/* Feedback and User Growth */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SimpleChart
          title="Feedback Trends"
          data={
            feedbackTrends?.monthlyTrends?.map(item => ({
              label: item.period,
              value: item.feedbackCount
            })) || []
          }
          type="bar"
          height={200}
        />
        <SimpleChart
          title="User Growth"
          data={
            userGrowth?.map(item => ({
              label: item.period,
              value: item.newUsers
            })) || []
          }
          type="line"
          height={200}
        />
      </div>

      {/* Training Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5" />
            Training Performance Overview
          </CardTitle>
          <CardDescription>
            <span className="text-sm text-muted-foreground">Top performing trainings</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {(coursePerformance && Array.isArray(coursePerformance) ? coursePerformance.slice(0, 5) : []).map((course, index) => (
              <div key={course.courseId} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-primary">{index + 1}</span>
                  </div>
                  <div>
                    <h4 className="font-medium">{course.courseTitle}</h4>
                    <p className="text-sm text-muted-foreground">
                      {course.totalEnrollments} enrollments
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 text-sm">
                  <div className="text-center">
                    <p className="font-medium">{(course.completionRate || 0).toFixed(1)}%</p>
                    <p className="text-muted-foreground">Completion</p>
                  </div>
                  <div className="text-center">
                    <p className="font-medium">{(course.averageRating || 0).toFixed(1)}</p>
                    <p className="text-muted-foreground">Rating</p>
                  </div>
                  <div className="text-center">
                    <p className="font-medium">{course.totalFeedback || 0}</p>
                    <p className="text-muted-foreground">Feedback</p>
                  </div>
                </div>
              </div>
            ))}
            {(!coursePerformance || coursePerformance.length === 0) && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No training performance data available</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Completion Rates by Training */}
      <Card>
        <CardHeader>
          <CardTitle>Completion Rates by Training</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {(completionRates?.byCourse && Array.isArray(completionRates.byCourse) ? completionRates.byCourse.slice(0, 8) : []).map((course) => (
              <div key={course.courseId} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{course.courseTitle}</span>
                  <span className="text-sm font-medium">{(course.completionRate || 0).toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${course.completionRate || 0}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{course.completed || 0} completed</span>
                  <span>{course.total || 0} total</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Overall Completion Summary */}
      {completionRates?.overall && (
        <Card>
          <CardHeader>
            <CardTitle>Overall Completion Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{completionRates.overall.total}</div>
                <p className="text-sm text-muted-foreground">Total Enrollments</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{completionRates.overall.completed}</div>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{completionRates.overall.dropped}</div>
                <p className="text-sm text-muted-foreground">Dropped</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{completionRates.overall.inProgress}</div>
                <p className="text-sm text-muted-foreground">In Progress</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}; 