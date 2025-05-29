'use client';

import { useEffect } from 'react';
import { useApi } from '@/hooks/useApi';
import { courseApi } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Skeleton } from '../../../components/ui/skeleton';
import { Alert, AlertDescription } from '../../../components/ui/alert';
import { AxiosResponse } from 'axios';

interface Course {
  id: string;
  title: string;
  description: string;
  organization: {
    name: string;
  };
  startDate: string;
  endDate: string;
}

interface ApiResponse {
  data: Course[];
  message?: string;
  status: string;
}

export default function CoursesPage() {
  const { data: response, loading, error, execute } = useApi<ApiResponse>();

  useEffect(() => {
    execute(() => courseApi.getAllCourses().then((res: AxiosResponse) => res.data));
  }, [execute]);

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Error loading courses: {error.message}
        </AlertDescription>
      </Alert>
    );
  }

  // Check if response exists and has data array
  const courses = response?.data || [];

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Available Courses</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          // Loading skeletons
          Array.from({ length: 6 }).map((_, i) => (
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
        ) : courses.length === 0 ? (
          <div className="col-span-full text-center py-8">
            <p className="text-muted-foreground">No courses available at the moment.</p>
          </div>
        ) : (
          // Course cards
          courses.map((course) => (
            <Card key={course.id} className="w-full hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>{course.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4 line-clamp-2">
                  {course.description}
                </p>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{course.organization.name}</span>
                  <span>
                    {new Date(course.startDate).toLocaleDateString()} - 
                    {new Date(course.endDate).toLocaleDateString()}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
} 