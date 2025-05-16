import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "./api";

export interface Training {
  _id: string;
  title: string;
  description: string;
  duration: number;
  capacity: number;
  startDate: string;
  endDate: string;
  location: string;
  isVirtual: boolean;
  virtualMeetingLink?: string;
  instructor: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  thumbnail?: {
    url: string;
    public_id: string;
  };
  status: string;
  accessibilityFeatures: string[];
}

interface TrainingResponse {
  success: boolean;
  count: number;
  data: Training[];
}

interface TrainingState {
  trainings: Training[];
  loading: boolean;
  error: string | null;
}

const initialState: TrainingState = {
  trainings: [],
  loading: false,
  error: null,
};

export const fetchTrainings = createAsyncThunk<
  Training[],
  void,
  { rejectValue: { message: string } }
>("trainings/fetchAll", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get<TrainingResponse>("/courses");
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data);
  }
});

const trainingApiSlice = createSlice({
  name: "trainings",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTrainings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTrainings.fulfilled, (state, action) => {
        state.loading = false;
        state.trainings = action.payload;
      })
      .addCase(fetchTrainings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message ?? "Failed to fetch trainings";
      });
  },
});

export default trainingApiSlice.reducer;
