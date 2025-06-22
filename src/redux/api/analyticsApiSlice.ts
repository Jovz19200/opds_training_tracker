import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "./api";

// Analytics API Slice
// Note: This layer uses "course" terminology to match the backend API
// Frontend components use "training" terminology for user-facing text

interface ErrorResponse {
  message: string;
  status?: number;
}

// Updated Analytics Data Interfaces based on actual API responses
export interface DashboardMetrics {
  overview: {
    totalUsers: number;
    totalCourses: number;
    activeEnrollments: number;
    completionRate: number;
  };
  recentActivity: {
    newUsersThisMonth: number;
    newCoursesThisMonth: number;
    newEnrollmentsThisMonth: number;
  };
  ratings: {
    overall: number;
    content: number;
    instructor: number;
    totalFeedback: number;
  };
  recentFeedback: Array<{
    _id: string;
    overallRating: number;
    contentRating: number;
    instructorRating: number;
    submissionDate: string;
    user: {
      _id: string;
      firstName: string;
      lastName: string;
    };
    course: {
      _id: string;
      title: string;
    };
  }>;
  upcomingCourses: Array<{
    _id: string;
    title: string;
    startDate: string;
    instructor: {
      _id: string;
      firstName: string;
      lastName: string;
    };
  }>;
}

export interface EnrollmentTrends {
  period: string;
  enrollments: number;
  completed: number;
  dropped: number;
  completionRate: string;
}

export interface FeedbackTrends {
  monthlyTrends: Array<{
    period: string;
    feedbackCount: number;
    avgOverallRating: number;
    avgContentRating: number;
    avgInstructorRating: number;
    avgFacilitiesRating: number;
    avgAccessibilityRating: number;
  }>;
  ratingDistribution: Array<{
    _id: number;
    count: number;
  }>;
  topCourses: Array<{
    courseId: string;
    courseTitle: string;
    avgRating: number;
    totalFeedback: number;
  }>;
}

export interface CompletionRates {
  overall: {
    total: number;
    completed: number;
    dropped: number;
    inProgress: number;
    completionRate: number;
  };
  byCourse: Array<{
    courseId: string;
    courseTitle: string;
    total: number;
    completed: number;
    dropped: number;
    completionRate: number;
  }>;
  byOrganization: Array<{
    organizationId: string;
    organizationName: string;
    total: number;
    completed: number;
    dropped: number;
    completionRate: number;
  }>;
}

export interface UserGrowth {
  period: string;
  newUsers: number;
  activeUsers: number;
  totalUsers: number;
}

export interface CoursePerformance {
  courseId: string;
  courseTitle: string;
  totalEnrollments: number;
  completedEnrollments: number;
  averageRating: number;
  totalFeedback: number;
  completionRate: number;
}

export interface CertificateAnalytics {
  trends: Array<{
    period: string;
    totalIssued: number;
    disabilityUsers: number;
    accessibilityRate: string;
  }>;
  disabilityAnalytics: Array<{
    _id: string;
    count: number;
    percentage: number;
  }>;
  verification: {
    total: number;
    verified: number;
    verificationRate: string;
  };
  recentCertificates: Array<{
    _id: string;
    issueDate: string;
    user: {
      _id: string;
      firstName: string;
      lastName: string;
      hasDisability: boolean;
      disabilityType: string;
    };
    course: {
      _id: string;
      title: string;
    };
  }>;
}

export interface AttendanceAnalytics {
  byMethod: Array<{
    _id: string;
    count: number;
    disabilityUsers: number;
  }>;
  trends: Array<{
    _id: {
      year: number;
      month: number;
      status: string;
    };
    count: number;
  }>;
  manualAttendance: {
    total: number;
    percentage: string;
  };
}

export interface DisabilityStats {
  _id: string;
  count: number;
}

export interface AccessibilityNeedsStats {
  _id: string;
  count: number;
}

export interface EnrollmentStatsByDisability {
  _id: string;
  enrollments: number;
  completions: number;
}

export interface ExportData {
  filename: string;
  size: number;
  createdAt: string;
  modifiedAt: string;
  downloadUrl: string;
}

export interface EnrollmentStats {
  totalCapacity: number;
  totalEnrolled: number;
  totalCompleted: number;
  totalDropped: number;
  totalFailed: number;
  availableSpots: number;
  enrollmentRate: number;
}

interface AnalyticsState {
  dashboardMetrics: DashboardMetrics | null;
  enrollmentTrends: EnrollmentTrends[];
  feedbackTrends: FeedbackTrends | null;
  completionRates: CompletionRates | null;
  userGrowth: UserGrowth[];
  coursePerformance: CoursePerformance[];
  certificateAnalytics: CertificateAnalytics | null;
  attendanceAnalytics: AttendanceAnalytics | null;
  disabilityStats: DisabilityStats[];
  accessibilityNeedsStats: AccessibilityNeedsStats[];
  enrollmentStatsByDisability: EnrollmentStatsByDisability[];
  exports: ExportData[];
  loading: boolean;
  error: string | null;
  enrollmentStats: EnrollmentStats | null;
  enrollmentStatsLoading: boolean;
  enrollmentStatsError: string | null;
}

const initialState: AnalyticsState = {
  dashboardMetrics: null,
  enrollmentTrends: [],
  feedbackTrends: null,
  completionRates: null,
  userGrowth: [],
  coursePerformance: [],
  certificateAnalytics: null,
  attendanceAnalytics: null,
  disabilityStats: [],
  accessibilityNeedsStats: [],
  enrollmentStatsByDisability: [],
  exports: [],
  loading: false,
  error: null,
  enrollmentStats: null,
  enrollmentStatsLoading: false,
  enrollmentStatsError: null,
};

// Dashboard & Trends
export const fetchDashboardMetrics = createAsyncThunk<DashboardMetrics, void, { rejectValue: ErrorResponse }>(
  "analytics/fetchDashboard",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/analytics/dashboard");
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const fetchEnrollmentTrends = createAsyncThunk<EnrollmentTrends[], { period?: string; startDate?: string; endDate?: string; courseId?: string; organizationId?: string }, { rejectValue: ErrorResponse }>(
  "analytics/fetchEnrollmentTrends",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await axios.get("/analytics/enrollment-trends", { params });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const fetchFeedbackTrends = createAsyncThunk<FeedbackTrends, { startDate?: string; endDate?: string; courseId?: string; instructorId?: string }, { rejectValue: ErrorResponse }>(
  "analytics/fetchFeedbackTrends",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await axios.get("/analytics/feedback-trends", { params });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const fetchCompletionRates = createAsyncThunk<CompletionRates, { startDate?: string; endDate?: string; courseId?: string; organizationId?: string }, { rejectValue: ErrorResponse }>(
  "analytics/fetchCompletionRates",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await axios.get("/analytics/completion-rates", { params });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const fetchUserGrowth = createAsyncThunk<UserGrowth[], { startDate?: string; endDate?: string; organizationId?: string }, { rejectValue: ErrorResponse }>(
  "analytics/fetchUserGrowth",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await axios.get("/analytics/user-growth", { params });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const fetchCoursePerformance = createAsyncThunk<CoursePerformance[], { startDate?: string; endDate?: string; organizationId?: string }, { rejectValue: ErrorResponse }>(
  "analytics/fetchCoursePerformance",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await axios.get("/analytics/course-performance", { params });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data);
    }
  }
);

// Certificate & Attendance Analytics
export const fetchCertificateAnalytics = createAsyncThunk<CertificateAnalytics, { startDate?: string; endDate?: string; organizationId?: string }, { rejectValue: ErrorResponse }>(
  "analytics/fetchCertificates",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await axios.get("/analytics/certificates", { params });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const fetchAttendanceAnalytics = createAsyncThunk<AttendanceAnalytics, { startDate?: string; endDate?: string; courseId?: string; organizationId?: string }, { rejectValue: ErrorResponse }>(
  "analytics/fetchAttendance",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await axios.get("/analytics/attendance", { params });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data);
    }
  }
);

// Disability & Accessibility Analytics
export const fetchDisabilityStats = createAsyncThunk<DisabilityStats[], void, { rejectValue: ErrorResponse }>(
  "analytics/fetchDisabilityStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/analytics/disability-type-stats");
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const fetchAccessibilityNeedsStats = createAsyncThunk<AccessibilityNeedsStats[], void, { rejectValue: ErrorResponse }>(
  "analytics/fetchAccessibilityNeedsStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/analytics/accessibility-needs-stats");
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const fetchEnrollmentStatsByDisability = createAsyncThunk<EnrollmentStatsByDisability[], void, { rejectValue: ErrorResponse }>(
  "analytics/fetchEnrollmentStatsByDisability",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/analytics/enrollment-stats-by-disability");
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data);
    }
  }
);

// Reports & Export
export const generateReport = createAsyncThunk<{ success: boolean; data?: any }, { reportType: string; startDate?: string; endDate?: string; courseId?: string; organizationId?: string; format?: string; includeCharts?: boolean }, { rejectValue: ErrorResponse }>(
  "analytics/generateReport",
  async (params, { rejectWithValue }) => {
    try {
      const response = await axios.post("/analytics/reports/generate", params);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const exportAnalytics = createAsyncThunk<{ success: boolean; data?: any }, { dataType: string; format: string; filters?: any }, { rejectValue: ErrorResponse }>(
  "analytics/exportAnalytics",
  async (params, { rejectWithValue }) => {
    try {
      const response = await axios.post("/analytics/export", params);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const fetchExports = createAsyncThunk<ExportData[], void, { rejectValue: ErrorResponse }>(
  "analytics/fetchExports",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/analytics/exports");
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const fetchEnrollmentStats = createAsyncThunk<EnrollmentStats, { courseId: string }, { rejectValue: ErrorResponse }>(
  "analytics/fetchEnrollmentStats",
  async ({ courseId }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/enrollments/course/${courseId}/enrollment-stats`);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data);
    }
  }
);

const analyticsApiSlice = createSlice({
  name: "analytics",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Dashboard Metrics
      .addCase(fetchDashboardMetrics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardMetrics.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboardMetrics = action.payload;
      })
      .addCase(fetchDashboardMetrics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch dashboard metrics";
      })
      // Enrollment Trends
      .addCase(fetchEnrollmentTrends.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchEnrollmentTrends.fulfilled, (state, action) => {
        state.enrollmentTrends = action.payload;
      })
      .addCase(fetchEnrollmentTrends.rejected, (state, action) => {
        state.error = action.payload?.message || "Failed to fetch enrollment trends";
      })
      // Feedback Trends
      .addCase(fetchFeedbackTrends.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchFeedbackTrends.fulfilled, (state, action) => {
        state.feedbackTrends = action.payload;
      })
      .addCase(fetchFeedbackTrends.rejected, (state, action) => {
        state.error = action.payload?.message || "Failed to fetch feedback trends";
      })
      // Completion Rates
      .addCase(fetchCompletionRates.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchCompletionRates.fulfilled, (state, action) => {
        state.completionRates = action.payload;
      })
      .addCase(fetchCompletionRates.rejected, (state, action) => {
        state.error = action.payload?.message || "Failed to fetch completion rates";
      })
      // User Growth
      .addCase(fetchUserGrowth.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchUserGrowth.fulfilled, (state, action) => {
        state.userGrowth = action.payload;
      })
      .addCase(fetchUserGrowth.rejected, (state, action) => {
        state.error = action.payload?.message || "Failed to fetch user growth";
      })
      // Course Performance
      .addCase(fetchCoursePerformance.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchCoursePerformance.fulfilled, (state, action) => {
        state.coursePerformance = action.payload;
      })
      .addCase(fetchCoursePerformance.rejected, (state, action) => {
        state.error = action.payload?.message || "Failed to fetch course performance";
      })
      // Certificate Analytics
      .addCase(fetchCertificateAnalytics.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchCertificateAnalytics.fulfilled, (state, action) => {
        state.certificateAnalytics = action.payload;
      })
      .addCase(fetchCertificateAnalytics.rejected, (state, action) => {
        state.error = action.payload?.message || "Failed to fetch certificate analytics";
      })
      // Attendance Analytics
      .addCase(fetchAttendanceAnalytics.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchAttendanceAnalytics.fulfilled, (state, action) => {
        state.attendanceAnalytics = action.payload;
      })
      .addCase(fetchAttendanceAnalytics.rejected, (state, action) => {
        state.error = action.payload?.message || "Failed to fetch attendance analytics";
      })
      // Disability Stats
      .addCase(fetchDisabilityStats.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchDisabilityStats.fulfilled, (state, action) => {
        state.disabilityStats = action.payload;
      })
      .addCase(fetchDisabilityStats.rejected, (state, action) => {
        state.error = action.payload?.message || "Failed to fetch disability stats";
      })
      // Accessibility Needs Stats
      .addCase(fetchAccessibilityNeedsStats.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchAccessibilityNeedsStats.fulfilled, (state, action) => {
        state.accessibilityNeedsStats = action.payload;
      })
      .addCase(fetchAccessibilityNeedsStats.rejected, (state, action) => {
        state.error = action.payload?.message || "Failed to fetch accessibility needs stats";
      })
      // Enrollment Stats by Disability
      .addCase(fetchEnrollmentStatsByDisability.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchEnrollmentStatsByDisability.fulfilled, (state, action) => {
        state.enrollmentStatsByDisability = action.payload;
      })
      .addCase(fetchEnrollmentStatsByDisability.rejected, (state, action) => {
        state.error = action.payload?.message || "Failed to fetch enrollment stats by disability";
      })
      // Exports
      .addCase(fetchExports.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchExports.fulfilled, (state, action) => {
        state.exports = action.payload;
      })
      .addCase(fetchExports.rejected, (state, action) => {
        state.error = action.payload?.message || "Failed to fetch exports";
      })
      // Enrollment Stats
      .addCase(fetchEnrollmentStats.pending, (state) => {
        state.enrollmentStatsLoading = true;
        state.enrollmentStatsError = null;
      })
      .addCase(fetchEnrollmentStats.fulfilled, (state, action) => {
        state.enrollmentStatsLoading = false;
        state.enrollmentStats = action.payload;
      })
      .addCase(fetchEnrollmentStats.rejected, (state, action) => {
        state.enrollmentStatsLoading = false;
        state.enrollmentStatsError = action.payload?.message || "Failed to fetch enrollment stats";
      });
  },
});

export const { clearError } = analyticsApiSlice.actions;
export default analyticsApiSlice.reducer; 