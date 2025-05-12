import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "./api";

interface Organization {
  _id: string;
  name: string;
  description: string;
  address: string;
  contactEmail: string;
  contactPhone: string;
  createdAt: string;
}

interface OrganizationResponse {
  success: boolean;
  count: number;
  data: Organization[];
}

interface OrganizationState {
  organizations: Organization[];
  loading: boolean;
  error: string | null;
}

const initialState: OrganizationState = {
  organizations: [],
  loading: false,
  error: null,
};

export const fetchOrganizations = createAsyncThunk<
  Organization[],
  void,
  { rejectValue: { message: string } }
>("organizations/fetchAll", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get<OrganizationResponse>("/organizations");
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data);
  }
});

const organizationApiSlice = createSlice({
  name: "organizations",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrganizations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrganizations.fulfilled, (state, action) => {
        state.loading = false;
        state.organizations = action.payload;
      })
      .addCase(fetchOrganizations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message ?? "Failed to fetch organizations";
      });
  },
});

export default organizationApiSlice.reducer; 