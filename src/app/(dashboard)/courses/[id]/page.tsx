'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useApi } from '@/hooks/useApi';
import { courseApi, enrollmentApi } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { AxiosResponse } from 'axios';

interface CourseDetail {
  id: string;
  title: string;
  description: string;
  organization: {
    name: string;
    id: string;
  };
  startDate: string;
  endDate: string;
  capacity: number;
  enrolledCount: number;
  isEnrolled: boolean;
}

export default function CourseDetailPage() {
  const params = useParams();
  const courseId = params.id as string;

  const { 
    data: course, 
    loading, 
    error, 
    execute: fetchCourse 
  } = useApi<CourseDetail>();

  const { 
    loading: enrolling, 
    execute: enroll 
  } = useApi();

  useEffect(() => {
    fetchCourse(() => courseApi.getCourseById(courseId).then((res: AxiosResponse) => res.data));
  }, [courseId, fetchCourse]);

  const handleEnroll = async () => {
    try {
      await enroll(() => enrollmentApi.enrollInCourse(courseId).then((res: AxiosResponse) => res.data));
      toast.success('Successfully enrolled in course!');
      // Refresh course data to update enrollment status
      fetchCourse(() => courseApi.getCourseById(courseId).then((res: AxiosResponse) => res.data));
    } catch (error) {
      toast.error('Failed to enroll in course. Please try again.');
    }
  };

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Error loading course: {error.message}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="container mx-auto py-8">
      {loading ? (
        <div className="space-y-6">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      ) : course ? (
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl">{course.title}</CardTitle>
              <p className="text-muted-foreground">
                {course.organization.name}
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-muted-foreground">{course.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Duration</h3>
                  <p className="text-muted-foreground">
                    {new Date(course.startDate).toLocaleDateString()} - 
                    {new Date(course.endDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Capacity</h3>
                  <p className="text-muted-foreground">
                    {course.enrolledCount} / {course.capacity} enrolled
                  </p>
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={handleEnroll}
                  disabled={enrolling || course.isEnrolled || course.enrolledCount >= course.capacity}
                >
                  {enrolling ? 'Enrolling...' : 
                   course.isEnrolled ? 'Already Enrolled' :
                   course.enrolledCount >= course.capacity ? 'Course Full' :
                   'Enroll Now'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : null}
    </div>
  );
} 