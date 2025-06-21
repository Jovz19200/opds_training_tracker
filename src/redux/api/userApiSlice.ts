import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "./api";

interface ErrorResponse {
  message: string;
  status?: number;
}

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  organization: string;
  status: 'active' | 'inactive';
  twoFAStatus: boolean;
  createdAt: string;
}

interface UserState {
  users: User[];
  selectedUser: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  users: [],
  selectedUser: null,
  loading: false,
  error: null,
};

// Fetch all users
export const fetchUsers = createAsyncThunk<User[], void, { rejectValue: ErrorResponse }>(
  "users/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/users");
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data);
    }
  }
);

// Fetch single user
export const fetchUserById = createAsyncThunk<User, string, { rejectValue: ErrorResponse }>(
  "users/fetchById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/users/${id}`);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data);
    }
  }
);

// Create user
export const createUser = createAsyncThunk<User, Partial<User>, { rejectValue: ErrorResponse }>(
  "users/create",
  async (userData: Partial<User>, { rejectWithValue }) => {
    try {
      const response = await axios.post("/users", userData);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data);
    }
  }
);

// Update user
export const updateUser = createAsyncThunk<User, { id: string; userData: Partial<User> }, { rejectValue: ErrorResponse }>(
  "users/update",
  async ({ id, userData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/users/${id}`, userData);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data);
    }
  }
);

// Delete user
export const deleteUser = createAsyncThunk<string, string, { rejectValue: ErrorResponse }>(
  "users/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      await axios.delete(`/users/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data);
    }
  }
);

// Enable 2FA for a user (Admin only)
export const enable2FAForUser = createAsyncThunk<
  User, 
  string, 
  { rejectValue: ErrorResponse }
>(
  "users/enable2FA",
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await axios.post(`/auth/enable2fa`, { userId });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data);
    }
  }
);

// Disable 2FA for a user (Admin only)
export const disable2FAForUser = createAsyncThunk<
  User, 
  string, 
  { rejectValue: ErrorResponse }
>(
  "users/disable2FA",
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await axios.post(`/auth/disable2fa`, { userId });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data);
    }
  }
);

const userApiSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    },
    clearSelectedUser: (state) => {
      state.selectedUser = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all users
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch users";
      })
      // Fetch single user
      .addCase(fetchUserById.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.selectedUser = action.payload;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.error = action.payload?.message || "Failed to fetch user";
      })
      // Create user
      .addCase(createUser.pending, (state) => {
        state.error = null;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.users.push(action.payload);
      })
      .addCase(createUser.rejected, (state, action) => {
        state.error = action.payload?.message || "Failed to create user";
      })
      // Update user
      .addCase(updateUser.pending, (state) => {
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        const index = state.users.findIndex(user => user._id === action.payload._id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
        if (state.selectedUser?._id === action.payload._id) {
          state.selectedUser = action.payload;
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.error = action.payload?.message || "Failed to update user";
      })
      // Delete user
      .addCase(deleteUser.pending, (state) => {
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter(user => user._id !== action.payload);
        if (state.selectedUser?._id === action.payload) {
          state.selectedUser = null;
        }
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.error = action.payload?.message || "Failed to delete user";
      })
      // Enable 2FA for user
      .addCase(enable2FAForUser.pending, (state) => {
        state.error = null;
      })
      .addCase(enable2FAForUser.fulfilled, (state, action) => {
        const index = state.users.findIndex(user => user._id === action.payload._id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
        if (state.selectedUser?._id === action.payload._id) {
          state.selectedUser = action.payload;
        }
      })
      .addCase(enable2FAForUser.rejected, (state, action) => {
        state.error = action.payload?.message || "Failed to enable 2FA";
      })
      // Disable 2FA for user
      .addCase(disable2FAForUser.pending, (state) => {
        state.error = null;
      })
      .addCase(disable2FAForUser.fulfilled, (state, action) => {
        const index = state.users.findIndex(user => user._id === action.payload._id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
        if (state.selectedUser?._id === action.payload._id) {
          state.selectedUser = action.payload;
        }
      })
      .addCase(disable2FAForUser.rejected, (state, action) => {
        state.error = action.payload?.message || "Failed to disable 2FA";
      });
  },
});

export const { setSelectedUser, clearSelectedUser } = userApiSlice.actions;
export default userApiSlice.reducer; 