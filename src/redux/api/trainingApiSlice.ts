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

// Fetch single training by ID
export const fetchTrainingById = createAsyncThunk<
  Course,
  string,
  { rejectValue: { message: string } }
>("trainings/fetchById", async (id, { rejectWithValue }) => {
  try {
    const response = await axios.get<{ success: boolean; data: Course }>(`/courses/${id}`);
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data);
  }
});

// Update training
export const updateTraining = createAsyncThunk<
  Course,
  { id: string; formData: FormData },
  { rejectValue: { message: string } }
>("trainings/update", async ({ id, formData }, { rejectWithValue }) => {
  try {
    const response = await axios.put<{ success: boolean; data: Course }>(`/courses/${id}`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data);
  }
});

// Delete training
export const deleteTraining = createAsyncThunk<
  string,
  string,
  { rejectValue: { message: string } }
>("trainings/delete", async (id, { rejectWithValue }) => {
  try {
    await axios.delete(`/courses/${id}`);
    return id;
  } catch (error: any) {
    return rejectWithValue(error.response?.data);
  }
});

// Fetch trainings by organization
export const fetchTrainingsByOrganization = createAsyncThunk<
  Course[],
  string,
  { rejectValue: { message: string } }
>("trainings/fetchByOrganization", async (organizationId, { rejectWithValue }) => {
  try {
    const response = await axios.get<{ success: boolean; data: Course[] }>(`/courses/organization/${organizationId}`);
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
      })
      .addCase(fetchTrainingById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTrainingById.fulfilled, (state, action) => {
        state.loading = false;
        // Optionally add/update the course in the list
        const idx = state.courses.findIndex(c => c._id === action.payload._id);
        if (idx !== -1) {
          state.courses[idx] = action.payload;
        } else {
          state.courses.push(action.payload);
        }
      })
      .addCase(fetchTrainingById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message ?? "Failed to fetch training";
      })
      .addCase(updateTraining.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTraining.fulfilled, (state, action) => {
        state.loading = false;
        const idx = state.courses.findIndex(c => c._id === action.payload._id);
        if (idx !== -1) {
          state.courses[idx] = action.payload;
        }
      })
      .addCase(updateTraining.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message ?? "Failed to update training";
      })
      .addCase(deleteTraining.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTraining.fulfilled, (state, action) => {
        state.loading = false;
        state.courses = state.courses.filter(c => c._id !== action.payload);
      })
      .addCase(deleteTraining.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message ?? "Failed to delete training";
      })
      .addCase(fetchTrainingsByOrganization.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTrainingsByOrganization.fulfilled, (state, action) => {
        state.loading = false;
        // Optionally replace or merge courses for the organization
        // For now, just replace all courses
        state.courses = action.payload;
      })
      .addCase(fetchTrainingsByOrganization.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message ?? "Failed to fetch trainings by organization";
      });
  },
});

export default trainingApiSlice.reducer;
