import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "./api";

export interface Course {
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
  organization: string;
  thumbnail?: {
    url: string;
    public_id: string;
  };
  materials: {
    title: string;
    fileUrl: string;
    fileType: string;
    uploadDate: string;
  }[];
  prerequisites: string[];
  status: 'scheduled' | 'active' | 'completed' | 'cancelled';
  accessibilityFeatures: string[];
  tags: string[];
  createdAt: string;
}

interface CourseResponse {
  success: boolean;
  count: number;
  data: Course[];
}

interface CourseState {
  courses: Course[];
  loading: boolean;
  error: string | null;
}

const initialState: CourseState = {
  courses: [],
  loading: false,
  error: null,
};

export const fetchTrainings = createAsyncThunk<
  Course[],
  void,
  { rejectValue: { message: string } }
>("trainings/fetchAll", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get<CourseResponse>("/courses");
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data);
  }
});

export const createTraining = createAsyncThunk<
  Course,
  { formData: FormData },
  { rejectValue: { message: string } }
>("trainings/create", async ({ formData }, { rejectWithValue }) => {
  try {
    const response = await axios.post<{ success: boolean; data: Course }>("/courses", formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
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
        state.courses = action.payload;
      })
      .addCase(fetchTrainings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message ?? "Failed to fetch courses";
      })
      .addCase(createTraining.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTraining.fulfilled, (state, action) => {
        state.loading = false;
        state.courses = [...state.courses, action.payload];
      })
      .addCase(createTraining.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message ?? "Failed to create course";
      });
  },
});

export default trainingApiSlice.reducer;
