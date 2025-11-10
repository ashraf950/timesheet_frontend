import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../services/api";

export const addTimesheet = createAsyncThunk(
  "timesheet/addTimesheet",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await API.post("/timesheet/add", formData);
      // Handle backend response structure: { success, message, data }
      return response.data.data || response.data.timesheet || response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to add timesheet");
    }
  }
);

export const fetchTimesheets = createAsyncThunk(
  "timesheet/fetchTimesheets",
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get("/timesheet");
      console.log("Fetch Timesheets Response:", response.data);
      
      // Handle multiple backend response structures
      let data;
      if (response.data.success && response.data.data && response.data.data.timesheets) {
        // Format: { success: true, data: { timesheets: [...] } }
        data = response.data.data.timesheets;
      } else if (response.data.data && Array.isArray(response.data.data)) {
        // Format: { data: [...] }
        data = response.data.data;
      } else if (response.data.timesheets) {
        // Format: { timesheets: [...] }
        data = response.data.timesheets;
      } else if (Array.isArray(response.data)) {
        // Format: [...]
        data = response.data;
      } else {
        // Fallback
        data = [];
      }
      
      console.log("Extracted data:", data);
      // Ensure we return an array
      const result = Array.isArray(data) ? data : [];
      console.log("Final result:", result);
      return result;
    } catch (error) {
      console.error("Fetch Timesheets Error:", error);
      return rejectWithValue(error.response?.data?.message || "Failed to fetch timesheets");
    }
  }
);

export const autoFillTimesheet = createAsyncThunk(
  "timesheet/autoFillTimesheet",
  async (date, { rejectWithValue }) => {
    try {
      const response = await API.post("/timesheet/auto-fill", { date });
      // Handle backend response structure
      return response.data.data || response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to auto-fill timesheet");
    }
  }
);

const timesheetSlice = createSlice({
  name: "timesheet",
  initialState: {
    list: [],
    loading: false,
    error: null,
    autoFillLoading: false,
    autoFillError: null,
    autoFillData: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
      state.autoFillError = null;
    },
    clearAutoFillData: (state) => {
      state.autoFillData = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch timesheets
      .addCase(fetchTimesheets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTimesheets.fulfilled, (state, action) => {
        state.loading = false;
        state.list = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchTimesheets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.list = []; // Ensure list is always an array
      })
      // Add timesheet
      .addCase(addTimesheet.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addTimesheet.fulfilled, (state, action) => {
        state.loading = false;
        state.list.push(action.payload);
      })
      .addCase(addTimesheet.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Auto-fill timesheet
      .addCase(autoFillTimesheet.pending, (state) => {
        state.autoFillLoading = true;
        state.autoFillError = null;
      })
      .addCase(autoFillTimesheet.fulfilled, (state, action) => {
        state.autoFillLoading = false;
        state.autoFillData = action.payload;
      })
      .addCase(autoFillTimesheet.rejected, (state, action) => {
        state.autoFillLoading = false;
        state.autoFillError = action.payload;
      });
  },
});

export const { clearError, clearAutoFillData } = timesheetSlice.actions;
export default timesheetSlice.reducer;
