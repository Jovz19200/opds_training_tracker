'use client';

import { useEffect } from 'react';
import { useApi } from '@/hooks/useApi';
import { enrollmentApi } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { AxiosResponse } from 'axios';

interface Enrollment {
  id: string;
  course: {
    id: string;
    title: string;
    startDate: string;
    endDate: string;
  };
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'COMPLETED';
  enrolledAt: string;
}

export default function EnrollmentsPage() {
  const { data: enrollments, loading, error, execute } = useApi<Enrollment[]>();

  useEffect(() => {
    execute(() => enrollmentApi.getAllEnrollments().then((res: AxiosResponse) => res.data));
  }, [execute]);

  const getStatusColor = (status: Enrollment['status']) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-green-500';
      case 'PENDING':
        return 'bg-yellow-500';
      case 'REJECTED':
        return 'bg-red-500';
      case 'COMPLETED':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Error loading enrollments: {error.message}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">My Enrollments</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          // Loading skeletons
          Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="w-full">
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
            </Card>
          ))
        ) : (
          // Enrollment cards
          enrollments?.map((enrollment) => (
            <Card key={enrollment.id} className="w-full hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl">{enrollment.course.title}</CardTitle>
                  <Badge className={getStatusColor(enrollment.status)}>
                    {enrollment.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Start Date: {new Date(enrollment.course.startDate).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    End Date: {new Date(enrollment.course.endDate).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Enrolled: {new Date(enrollment.enrolledAt).toLocaleDateString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
} 