import React, { useEffect } from "react";
import { Users, BarChart3, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import OTMSLoader from "./OTMSLoader";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/redux/store";
import { fetchEnrollmentStats } from "@/redux/api/analyticsApiSlice";
import { enrollInCourse, resetEnrollStatus } from "@/redux/api/trainingApiSlice";
import { Button } from "@/components/ui/button";

interface EnrollmentsStatsProps {
  courseId: string;
  compact?: boolean;
}

const EnrollmentsStats: React.FC<EnrollmentsStatsProps> = ({ courseId, compact }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { enrollmentStats, enrollmentStatsLoading, enrollmentStatsError } = useSelector((state: RootState) => state.analytics);
  const { enrollLoading, enrollError, enrollSuccess } = useSelector((state: RootState) => state.trainings);

  useEffect(() => {
    if (courseId) {
      dispatch(fetchEnrollmentStats({ courseId }));
      dispatch(resetEnrollStatus());
    }
  }, [dispatch, courseId]);

  // Reset enroll state on courseId change
  useEffect(() => {
    // Optionally, you can dispatch a reset action if you add one to the slice
    // For now, just ignore as state will update on new enroll
  }, [courseId]);

  if (enrollmentStatsLoading) return <div className="flex justify-center items-center h-32"><OTMSLoader /></div>;
  if (enrollmentStatsError) return <div className="flex items-center gap-2 text-destructive"><AlertCircle className="w-5 h-5" /> {enrollmentStatsError}</div>;
  if (!enrollmentStats) return null;

  const cardClass = compact
    ? "flex items-center gap-3 p-3 rounded-lg shadow bg-white dark:bg-slate-800 border"
    : "flex items-center gap-4 p-6 rounded-xl shadow bg-white dark:bg-slate-800 border";
  const iconClass = compact ? "w-6 h-6 text-primary" : "w-8 h-8 text-primary";
  const labelClass = compact ? "text-sm font-medium" : "text-lg font-semibold";
  const valueClass = compact ? "text-lg font-bold" : "text-2xl font-bold";

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className={cardClass}>
          <Users className={iconClass} />
          <div>
            <div className={labelClass}>Total Capacity</div>
            <div className={valueClass}>{enrollmentStats.totalCapacity}</div>
          </div>
        </div>
        <div className={cardClass}>
          <CheckCircle className={iconClass} />
          <div>
            <div className={labelClass}>Total Enrolled</div>
            <div className={valueClass}>{enrollmentStats.totalEnrolled}</div>
          </div>
        </div>
        <div className={cardClass}>
          <BarChart3 className={iconClass} />
          <div>
            <div className={labelClass}>Available Spots</div>
            <div className={valueClass}>{enrollmentStats.availableSpots}</div>
          </div>
        </div>
        <div className={cardClass}>
          <BarChart3 className={iconClass} />
          <div>
            <div className={labelClass}>Enrollment Rate</div>
            <div className={valueClass}>{enrollmentStats.enrollmentRate}%</div>
          </div>
        </div>
      </div>
      <Button
        className="mt-4 w-full max-w-xs self-center"
        onClick={() => dispatch(enrollInCourse({ courseId }))}
        disabled={enrollLoading || enrollSuccess}
      >
        {enrollLoading ? <Loader2 className="animate-spin w-5 h-5 mr-2" /> : null}
        {enrollSuccess ? "Enrolled" : enrollLoading ? "Enrolling..." : "Enroll"}
      </Button>
      {enrollError && <div className="text-destructive text-center mt-2 flex items-center justify-center gap-2"><AlertCircle className="w-4 h-4" />{enrollError}</div>}
      {enrollSuccess && <div className="text-green-600 dark:text-green-400 text-center mt-2 flex items-center justify-center gap-2"><CheckCircle className="w-4 h-4" />Successfully enrolled!<br>Check your email for the confirmation.</br></div>}
    </div>
  );
};

export default EnrollmentsStats; 