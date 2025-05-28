'use client';

import { useEffect } from 'react';
import { useApi } from '@/hooks/useApi';
import { resourceApi } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { AxiosResponse } from 'axios';

interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'DOCUMENT' | 'VIDEO' | 'LINK';
  url: string;
  isAvailable: boolean;
  course: {
    title: string;
  };
}

interface ApiResponse {
  data: Resource[];
  message?: string;
  status: string;
}

export default function ResourcesPage() {
  const { data: response, loading, error, execute } = useApi<ApiResponse>();

  useEffect(() => {
    execute(() => resourceApi.getAllResources().then((res: AxiosResponse) => res.data));
  }, [execute]);

  const handleResourceClick = async (resource: Resource) => {
    if (!resource.isAvailable) {
      toast.error('This resource is not available at the moment.');
      return;
    }

    try {
      const availability = await resourceApi.checkResourceAvailability(resource.id)
        .then((res: AxiosResponse) => res.data);
      if (availability.isAvailable) {
        window.open(resource.url, '_blank');
      } else {
        toast.error('Resource is currently unavailable. Please try again later.');
      }
    } catch (error) {
      toast.error('Failed to access resource. Please try again.');
    }
  };

  const getResourceTypeIcon = (type: Resource['type']) => {
    switch (type) {
      case 'DOCUMENT':
        return '📄';
      case 'VIDEO':
        return '🎥';
      case 'LINK':
        return '🔗';
      default:
        return '📎';
    }
  };

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Error loading resources: {error.message}
        </AlertDescription>
      </Alert>
    );
  }

  // Check if response exists and has data array
  const resources = response?.data || [];

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Course Resources</h1>
      
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
        ) : resources.length === 0 ? (
          <div className="col-span-full text-center py-8">
            <p className="text-muted-foreground">No resources available at the moment.</p>
          </div>
        ) : (
          // Resource cards
          resources.map((resource) => (
            <Card key={resource.id} className="w-full hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl">
                    {getResourceTypeIcon(resource.type)} {resource.title}
                  </CardTitle>
                  <Badge variant={resource.isAvailable ? "default" : "secondary"}>
                    {resource.isAvailable ? 'Available' : 'Unavailable'}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {resource.course.title}
                </p>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4 line-clamp-2">
                  {resource.description}
                </p>
                <Button
                  onClick={() => handleResourceClick(resource)}
                  disabled={!resource.isAvailable}
                  className="w-full"
                >
                  {resource.isAvailable ? 'Access Resource' : 'Unavailable'}
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
} 