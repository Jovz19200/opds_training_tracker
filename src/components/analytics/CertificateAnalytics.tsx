"use client"

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '@/redux/store';
import { fetchCertificateAnalytics } from '@/redux/api/analyticsApiSlice';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SimpleChart } from './SimpleChart';
import { Award, CheckCircle, Clock, AlertCircle } from 'lucide-react';

export const CertificateAnalytics: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { certificateAnalytics, loading } = useSelector((state: RootState) => state.analytics);

  useEffect(() => {
    dispatch(fetchCertificateAnalytics());
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

  if (!certificateAnalytics) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Certificate Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">No certificate data available</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { trends, disabilityAnalytics, verification, recentCertificates } = certificateAnalytics;

  return (
    <div className="space-y-6">
      {/* Certificate Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Issued</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {trends && trends.length > 0 
                ? trends.reduce((sum, item) => sum + (item.totalIssued || 0), 0).toLocaleString()
                : '0'
              }
            </div>
            <p className="text-xs text-muted-foreground">Certificates issued</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Verified</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(verification?.verified || 0).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Successfully verified</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Verification Rate</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{verification?.verificationRate || '0%'}</div>
            <p className="text-xs text-muted-foreground">Verification success rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Certificate Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SimpleChart
          title="Certificate Issuance Trends"
          data={
            trends?.map(item => ({
              label: item.period,
              value: item.totalIssued
            })) || []
          }
          type="line"
          height={200}
        />
        <SimpleChart
          title="Disability Users Certificates"
          data={
            trends?.map(item => ({
              label: item.period,
              value: item.disabilityUsers
            })) || []
          }
          type="bar"
          height={200}
        />
      </div>

      {/* Disability Breakdown Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SimpleChart
          title="Certificates by Disability Type"
          data={(disabilityAnalytics || []).map(item => ({
            label: item._id,
            value: item.count
          }))}
          type="pie"
        />
        <Card>
          <CardHeader>
            <CardTitle>Disability Type Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {(disabilityAnalytics || []).map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span className="text-sm font-medium">{item._id}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">{item.count}</span>
                    <Badge variant="outline">{(item.percentage || 0).toFixed(1)}%</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Certificates Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Recent Certificates
            <Badge variant="outline">
              {(recentCertificates || []).length} recent
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {(recentCertificates || []).slice(0, 10).map((certificate) => (
              <div key={certificate._id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-10 h-10 bg-blue-100 text-blue-600 rounded-full">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-medium">
                      {certificate.user?.firstName || 'Unknown'} {certificate.user?.lastName || 'User'}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {certificate.training?.title || certificate.course?.title || 'Unknown Training'}
                    </p>
                    {certificate.user?.hasDisability && (
                      <p className="text-xs text-orange-600">
                        Disability: {certificate.user.disabilityType || 'Unknown'}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {certificate.issueDate ? new Date(certificate.issueDate).toLocaleDateString() : 'Unknown Date'}
                    </p>
                    <p className="text-xs text-muted-foreground">Issued Date</p>
                  </div>
                  <Badge 
                    variant={certificate.user?.hasDisability ? 'secondary' : 'default'}
                    className="flex items-center space-x-1"
                  >
                    {certificate.user?.hasDisability ? (
                      <AlertCircle className="w-3 h-3" />
                    ) : (
                      <CheckCircle className="w-3 h-3" />
                    )}
                    <span>{certificate.user?.hasDisability ? 'Disability' : 'Standard'}</span>
                  </Badge>
                </div>
              </div>
            )) || (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No recent certificates available</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 