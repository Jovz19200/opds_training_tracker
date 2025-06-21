import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "./api";

export interface Feedback {
  _id: string;
  courseId: string;
  userId: string;
  comment: string;
  rating: number;
  createdAt: string;
  updatedAt: string;
}

interface FeedbackState {
  feedbacks: Feedback[];
  selectedFeedback: Feedback | null;
  loading: boolean;
  error: string | null;
}

const initialState: FeedbackState = {
  feedbacks: [],
  selectedFeedback: null,
  loading: false,
  error: null,
};

// Get all feedback
export const fetchFeedbacks = createAsyncThunk<
  Feedback[],
  void,
  { rejectValue: { message: string } }
>("feedback/fetchAll", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get<{ data: Feedback[] }>("/feedback");
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
    const response = await axios.get<{ data: Feedback }>(`/feedback/${id}`);
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
    const response = await axios.post<{ data: Feedback }>(`/feedback/${courseId}/feedback`, feedback);
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data);
  }
});

// Update feedback
export const updateFeedback = createAsyncThunk<
  Feedback,
  { id: string; feedback: { comment: string; rating: number } },
  { rejectValue: { message: string } }
>("feedback/update", async ({ id, feedback }, { rejectWithValue }) => {
  try {
    const response = await axios.put<{ data: Feedback }>(`/feedback/${id}`, feedback);
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
      });
  },
});

export default feedbackApiSlice.reducer; 