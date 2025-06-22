"use client"

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '@/redux/store';
import { fetchAttendanceAnalytics } from '@/redux/api/analyticsApiSlice';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SimpleChart } from './SimpleChart';
import { Users, QrCode, PenTool, TrendingUp } from 'lucide-react';

export const AttendanceAnalytics: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { attendanceAnalytics, loading } = useSelector((state: RootState) => state.analytics);

  useEffect(() => {
    dispatch(fetchAttendanceAnalytics());
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

  if (!attendanceAnalytics) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Attendance Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">No attendance data available</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { byMethod, trends, manualAttendance } = attendanceAnalytics;
  const totalAttendance = byMethod?.reduce((sum, method) => sum + (method.count || 0), 0) || 0;

  return (
    <div className="space-y-6">
      {/* Attendance Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Attendance</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAttendance.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Total attendance records</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">QR Attendance</CardTitle>
            <QrCode className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(byMethod?.find(m => m._id === 'qr')?.count || 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">QR code scans</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Manual Attendance</CardTitle>
            <PenTool className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(manualAttendance?.total || 0).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Manually recorded</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Manual Percentage</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{manualAttendance?.percentage || '0%'}</div>
            <p className="text-xs text-muted-foreground">Manual attendance rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Attendance Method Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SimpleChart
          title="Attendance by Method"
          data={(byMethod || []).map(method => ({
            label: method._id,
            value: method.count
          }))}
          type="pie"
        />
        <Card>
          <CardHeader>
            <CardTitle>Attendance Method Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {(byMethod || []).map((method, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {method._id === 'qr' ? (
                      <QrCode className="w-4 h-4 text-blue-500" />
                    ) : (
                      <PenTool className="w-4 h-4 text-green-500" />
                    )}
                    <span className="text-sm font-medium">
                      {method._id === 'qr' ? 'QR Code' : method._id} Attendance
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">{method.count.toLocaleString()}</span>
                    <Badge variant="outline">
                      {totalAttendance > 0 ? ((method.count / totalAttendance) * 100).toFixed(1) : '0'}%
                    </Badge>
                    {method.disabilityUsers > 0 && (
                      <Badge variant="secondary" className="text-xs">
                        {method.disabilityUsers} disability users
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Attendance Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Attendance Trends by Month</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {trends?.map((trend, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-10 h-10 bg-purple-100 text-purple-600 rounded-full">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-medium">
                      {trend._id.year}-{String(trend._id.month).padStart(2, '0')}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Status: {trend._id.status}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{trend.count.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Attendance</p>
                </div>
              </div>
            )) || (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No attendance trends data available</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Attendance Trends Chart */}
      <SimpleChart
        title="Monthly Attendance Trends"
        data={(trends || []).map(trend => ({
          label: `${trend._id.year}-${String(trend._id.month).padStart(2, '0')}`,
          value: trend.count
        }))}
        type="bar"
        height={200}
      />
    </div>
  );
}; 