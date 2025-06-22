"use client"

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '@/redux/store';
import { 
  fetchDisabilityStats, 
  fetchAccessibilityNeedsStats,
  fetchEnrollmentStatsByDisability
} from '@/redux/api/analyticsApiSlice';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SimpleChart } from './SimpleChart';
import { Accessibility, Users, GraduationCap, Heart } from 'lucide-react';

export const DisabilityAnalytics: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { 
    disabilityStats, 
    accessibilityNeedsStats, 
    enrollmentStatsByDisability,
    loading 
  } = useSelector((state: RootState) => state.analytics);

  useEffect(() => {
    dispatch(fetchDisabilityStats());
    dispatch(fetchAccessibilityNeedsStats());
    dispatch(fetchEnrollmentStatsByDisability());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Card className="animate-pulse">
          <CardHeader>
            <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          </CardHeader>
          <CardContent>
            <div className="h-48 bg-gray-200 rounded"></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const totalDisabilityUsers = disabilityStats?.reduce((sum, stat) => sum + (stat.count || 0), 0) || 0;
  const totalAccessibilityNeeds = accessibilityNeedsStats?.reduce((sum, stat) => sum + (stat.count || 0), 0) || 0;
  const totalEnrollments = enrollmentStatsByDisability?.reduce((sum, stat) => sum + (stat.enrollments || 0), 0) || 0;
  const totalCompletions = enrollmentStatsByDisability?.reduce((sum, stat) => sum + (stat.completions || 0), 0) || 0;

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Disability Users</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDisabilityUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Users with disabilities</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Accessibility Needs</CardTitle>
            <Accessibility className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAccessibilityNeeds.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Accessibility requirements</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Enrollments</CardTitle>
            <GraduationCap className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEnrollments.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Disability user enrollments</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <Heart className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalEnrollments > 0 ? ((totalCompletions / totalEnrollments) * 100).toFixed(1) : '0'}%
            </div>
            <p className="text-xs text-muted-foreground">Disability user completion</p>
          </CardContent>
        </Card>
      </div>

      {/* Disability Type Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SimpleChart
          title="Users by Disability Type"
          data={(disabilityStats || []).map(stat => ({
            label: stat._id,
            value: stat.count
          }))}
          type="pie"
        />
        <Card>
          <CardHeader>
            <CardTitle>Disability Type Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {(disabilityStats || []).map((stat, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span className="text-sm font-medium">{stat._id}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">{stat.count.toLocaleString()}</span>
                    <Badge variant="outline">
                      {totalDisabilityUsers > 0 ? ((stat.count / totalDisabilityUsers) * 100).toFixed(1) : '0'}%
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Accessibility Needs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SimpleChart
          title="Accessibility Needs Distribution"
          data={(accessibilityNeedsStats || []).map(stat => ({
            label: stat._id,
            value: stat.count
          }))}
          type="bar"
          height={200}
        />
        <Card>
          <CardHeader>
            <CardTitle>Accessibility Needs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {(accessibilityNeedsStats || []).map((stat, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Accessibility className="w-4 h-4 text-green-500" />
                    <span className="text-sm font-medium">{stat._id}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">{stat.count.toLocaleString()}</span>
                    <Badge variant="outline">
                      {totalAccessibilityNeeds > 0 ? ((stat.count / totalAccessibilityNeeds) * 100).toFixed(1) : '0'}%
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enrollment and Completion by Disability */}
      <Card>
        <CardHeader>
          <CardTitle>Enrollment and Completion by Disability Type</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {(enrollmentStatsByDisability || []).map((stat, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-10 h-10 bg-purple-100 text-purple-600 rounded-full">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-medium">{stat._id}</h4>
                    <p className="text-sm text-muted-foreground">
                      {stat.enrollments} enrollments, {stat.completions} completions
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm font-medium">{stat.enrollments.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Enrollments</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{stat.completions.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Completions</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {stat.enrollments > 0 ? ((stat.completions / stat.enrollments) * 100).toFixed(1) : '0'}%
                    </p>
                    <p className="text-xs text-muted-foreground">Rate</p>
                  </div>
                </div>
              </div>
            )) || (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No enrollment data by disability available</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Completion Rate Chart */}
      <SimpleChart
        title="Completion Rates by Disability Type"
        data={(enrollmentStatsByDisability || []).map(stat => ({
          label: stat._id,
          value: stat.enrollments > 0 ? (stat.completions / stat.enrollments) * 100 : 0
        }))}
        type="bar"
        height={200}
      />
    </div>
  );
}; 