"use client"

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  BookOpen, 
  Award, 
  TrendingUp, 
  Star, 
  FileText,
  Clock,
  CheckCircle,
  Calendar,
  UserPlus
} from 'lucide-react';
import { useSelector } from 'react-redux';
import type { RootState } from '@/redux/store';

interface MetricCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  trendLabel?: string;
  className?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  description,
  icon,
  trend,
  trendLabel,
  className
}) => (
  <Card className={className}>
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">
        {title}
      </CardTitle>
      <div className="text-muted-foreground">
        {icon}
      </div>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground mt-1">
        {description}
      </p>
      {trend && (
        <div className="flex items-center mt-2">
          <Badge 
            variant={trend.isPositive ? "default" : "destructive"}
            className="text-xs"
          >
            <TrendingUp className="w-3 h-3 mr-1" />
            {trend.isPositive ? '+' : ''}{trend.value}%
          </Badge>
          <span className="text-xs text-muted-foreground ml-2">
            {trendLabel}
          </span>
        </div>
      )}
    </CardContent>
  </Card>
);

export const MetricsCards: React.FC = () => {
  const dashboardMetrics = useSelector((state: RootState) => state.analytics.dashboardMetrics);
  const loading = useSelector((state: RootState) => state.analytics.loading);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(8)].map((_, index) => (
          <Card key={index} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-full"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!dashboardMetrics) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Users"
          value="0"
          description="Active users in the system"
          icon={<Users className="h-4 w-4" />}
        />
        <MetricCard
          title="Total Trainings"
          value="0"
          description="Available trainings"
          icon={<BookOpen className="h-4 w-4" />}
        />
        <MetricCard
          title="Active Enrollments"
          value="0"
          description="Current enrollments"
          icon={<CheckCircle className="h-4 w-4" />}
        />
        <MetricCard
          title="Completion Rate"
          value="0%"
          description="Overall completion rate"
          icon={<Star className="h-4 w-4" />}
        />
      </div>
    );
  }

  const { overview, recentActivity, ratings } = dashboardMetrics;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricCard
        title="Total Users"
        value={(overview?.totalUsers || 0).toLocaleString()}
        description="Active users in the system"
        icon={<Users className="h-4 w-4" />}
      />
      <MetricCard
        title="Total Trainings"
        value={(overview?.totalCourses || 0).toLocaleString()}
        description="Available trainings"
        icon={<BookOpen className="h-4 w-4" />}
      />
      <MetricCard
        title="Active Enrollments"
        value={(overview?.activeEnrollments || 0).toLocaleString()}
        description="Current enrollments"
        icon={<CheckCircle className="h-4 w-4" />}
      />
      <MetricCard
        title="Completion Rate"
        value={`${(overview?.completionRate || 0).toFixed(1)}%`}
        description="Overall completion rate"
        icon={<Star className="h-4 w-4" />}
      />
      <MetricCard
        title="New Users This Month"
        value={(recentActivity?.newUsersThisMonth || 0).toLocaleString()}
        description="New registrations"
        icon={<UserPlus className="h-4 w-4" />}
      />
      <MetricCard
        title="New Trainings This Month"
        value={(recentActivity?.newCoursesThisMonth || 0).toLocaleString()}
        description="New trainings added"
        icon={<Calendar className="h-4 w-4" />}
      />
      <MetricCard
        title="Total Feedback"
        value={(ratings?.totalFeedback || 0).toLocaleString()}
        description="Feedback entries"
        icon={<FileText className="h-4 w-4" />}
      />
      <MetricCard
        title="Average Rating"
        value={(ratings?.overall || 0).toFixed(1)}
        description="Average training rating"
        icon={<Star className="h-4 w-4" />}
      />
    </div>
  );
}; 