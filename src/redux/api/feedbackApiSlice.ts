import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "./api";

export interface Feedback {
  _id: string;
  user: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  course: {
    _id: string;
    title: string;
    id: string;
  };
  enrollment: {
    _id: string;
    user: string;
    course: string;
    enrollmentDate: string;
    status: string;
    certificateIssued: boolean;
    completionDate: string;
  };
  overallRating: number;
  contentRating: number;
  instructorRating: number;
  facilitiesRating: number;
  accessibilityRating: number;
  commentContent: string;
  commentInstructor: string;
  commentGeneral: string;
  suggestions: string;
  isAnonymous: boolean;
  submissionDate: string;
}

interface FeedbackState {
  feedbacks: Feedback[];
  selectedFeedback: Feedback | null;
  loading: boolean;
  error: string | null;
  courseFeedbacks: Feedback[];
  courseFeedbacksLoading: boolean;
  courseFeedbacksError: string | null;
  submitFeedbackLoading: boolean;
  submitFeedbackError: string | null;
  submitFeedbackSuccess: boolean;
}

const initialState: FeedbackState = {
  feedbacks: [],
  selectedFeedback: null,
  loading: false,
  error: null,
  courseFeedbacks: [],
  courseFeedbacksLoading: false,
  courseFeedbacksError: null,
  submitFeedbackLoading: false,
  submitFeedbackError: null,
  submitFeedbackSuccess: false,
};

// Get all feedback
export const fetchFeedbacks = createAsyncThunk<
  Feedback[],
  void,
  { rejectValue: { message: string } }
>("feedback/fetchAll", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get<{ success: boolean; count: number; pagination: any; data: Feedback[] }>("/feedback");
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data);
  }
});

// Get feedback by ID
export const fetchFeedbackById = createAsyncThunk<
  Feedback,
  string,
  { rejectValue: { message: string } }
>("feedback/fetchById", async (id, { rejectWithValue }) => {
  try {
    const response = await axios.get<{ success: boolean; data: Feedback }>(`/feedback/${id}`);
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data);
  }
});

// Create feedback for a course
export const createFeedback = createAsyncThunk<
  Feedback,
  { courseId: string; feedback: { comment: string; rating: number } },
  { rejectValue: { message: string } }
>("feedback/create", async ({ courseId, feedback }, { rejectWithValue }) => {
  try {
    const response = await axios.post<{ success: boolean; data: Feedback }>(`/feedback/${courseId}/feedback`, feedback);
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data);
  }
});

// Update feedback
export const updateFeedback = createAsyncThunk<
  Feedback,
  { 
    id: string; 
    feedback: { 
      commentContent?: string; 
      commentInstructor?: string; 
      commentGeneral?: string; 
      suggestions?: string;
      overallRating?: number;
      contentRating?: number;
      instructorRating?: number;
      facilitiesRating?: number;
      accessibilityRating?: number;
    } 
  },
  { rejectValue: { message: string } }
>("feedback/update", async ({ id, feedback }, { rejectWithValue }) => {
  try {
    const response = await axios.put<{ success: boolean; data: Feedback }>(`/feedback/${id}`, feedback);
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data);
  }
});

// Delete feedback
export const deleteFeedback = createAsyncThunk<
  string,
  string,
  { rejectValue: { message: string } }
>("feedback/delete", async (id, { rejectWithValue }) => {
  try {
    await axios.delete(`/feedback/${id}`);
    return id;
  } catch (error: any) {
    return rejectWithValue(error.response?.data);
  }
});

export const fetchCourseFeedbacks = createAsyncThunk<Feedback[], { courseId: string }, { rejectValue: { message: string } }>(
  "feedback/fetchCourseFeedbacks",
  async ({ courseId }, { rejectWithValue }) => {
    try {
      const response = await axios.get<{ success: boolean; count: number; data: Feedback[] }>(`/courses/${courseId}/feedback`);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const submitCourseFeedback = createAsyncThunk<Feedback, { courseId: string; feedback: any }, { rejectValue: { message: string } }>(
  "feedback/submitCourseFeedback",
  async ({ courseId, feedback }, { rejectWithValue }) => {
    try {
      const response = await axios.post<{ success: boolean; data: Feedback }>(`/courses/${courseId}/feedback`, feedback);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data);
    }
  }
);

const feedbackApiSlice = createSlice({
  name: "feedback",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeedbacks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFeedbacks.fulfilled, (state, action) => {
        state.loading = false;
        state.feedbacks = action.payload;
      })
      .addCase(fetchFeedbacks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch feedback";
      })
      .addCase(fetchFeedbackById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFeedbackById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedFeedback = action.payload;
      })
      .addCase(fetchFeedbackById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch feedback by id";
      })
      .addCase(createFeedback.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createFeedback.fulfilled, (state, action) => {
        state.loading = false;
        state.feedbacks.push(action.payload);
      })
      .addCase(createFeedback.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to create feedback";
      })
      .addCase(updateFeedback.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateFeedback.fulfilled, (state, action) => {
        state.loading = false;
        const idx = state.feedbacks.findIndex(fb => fb._id === action.payload._id);
        if (idx !== -1) state.feedbacks[idx] = action.payload;
        if (state.selectedFeedback?._id === action.payload._id) {
          state.selectedFeedback = action.payload;
        }
      })
      .addCase(updateFeedback.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to update feedback";
      })
      .addCase(deleteFeedback.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteFeedback.fulfilled, (state, action) => {
        state.loading = false;
        state.feedbacks = state.feedbacks.filter(fb => fb._id !== action.payload);
        if (state.selectedFeedback?._id === action.payload) {
          state.selectedFeedback = null;
        }
      })
      .addCase(deleteFeedback.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to delete feedback";
      })
      // Fetch Course Feedbacks
      .addCase(fetchCourseFeedbacks.pending, (state) => {
        state.courseFeedbacksLoading = true;
        state.courseFeedbacksError = null;
      })
      .addCase(fetchCourseFeedbacks.fulfilled, (state, action) => {
        state.courseFeedbacksLoading = false;
        state.courseFeedbacks = action.payload;
      })
      .addCase(fetchCourseFeedbacks.rejected, (state, action) => {
        state.courseFeedbacksLoading = false;
        state.courseFeedbacksError = action.payload?.message || "Failed to fetch course feedbacks";
      })
      .addCase(submitCourseFeedback.pending, (state) => {
        state.submitFeedbackLoading = true;
        state.submitFeedbackError = null;
        state.submitFeedbackSuccess = false;
      })
      .addCase(submitCourseFeedback.fulfilled, (state, action) => {
        state.submitFeedbackLoading = false;
        state.submitFeedbackSuccess = true;
        state.feedbacks.push(action.payload);
      })
      .addCase(submitCourseFeedback.rejected, (state, action) => {
        state.submitFeedbackLoading = false;
        state.submitFeedbackError = action.payload?.message || "Failed to submit course feedback";
      });
  },
});

export default feedbackApiSlice.reducer; 