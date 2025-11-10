import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../services/api";

// Async thunk for fetching pending approvals
export const fetchPendingApprovals = createAsyncThunk(
  "approval/fetchPendingApprovals",
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get("/approval/pending");
      console.log("Fetch Pending Approvals Response:", response.data);
      
      // Handle multiple backend response structures
      let data;
      if (response.data.success && response.data.data && response.data.data.timesheets) {
        // Format: { success: true, data: { timesheets: [...] } }
        data = response.data.data.timesheets;
      } else if (response.data.success && response.data.data && response.data.data.approvals) {
        // Format: { success: true, data: { approvals: [...] } }
        data = response.data.data.approvals;
      } else if (response.data.data && Array.isArray(response.data.data)) {
        // Format: { data: [...] }
        data = response.data.data;
      } else if (response.data.approvals) {
        // Format: { approvals: [...] }
        data = response.data.approvals;
      } else if (response.data.timesheets) {
        // Format: { timesheets: [...] }
        data = response.data.timesheets;
      } else if (Array.isArray(response.data)) {
        // Format: [...]
        data = response.data;
      } else {
        data = [];
      }
      
      console.log("Extracted approvals:", data);
      const result = Array.isArray(data) ? data : [];
      console.log("Final approvals result:", result);
      return result;
    } catch (error) {
      console.error("Fetch Approvals Error:", error);
      return rejectWithValue(error.response?.data?.message || "Failed to fetch pending approvals");
    }
  }
);

// Async thunk for updating approval status
export const updateApproval = createAsyncThunk(
  "approval/updateApproval",
  async ({ id, status, comments }, { rejectWithValue }) => {
    try {
      const response = await API.put(`/approval/update/${id}`, { status, comments });
      return response.data.data || response.data.approval || response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update approval");
    }
  }
);

const approvalSlice = createSlice({
  name: "approval",
  initialState: {
    pendingApprovals: [],
    loading: false,
    error: null,
    updateLoading: false,
    updateError: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
      state.updateError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch pending approvals
      .addCase(fetchPendingApprovals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPendingApprovals.fulfilled, (state, action) => {
        state.loading = false;
        state.pendingApprovals = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchPendingApprovals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.pendingApprovals = []; // Ensure it's always an array
      })
      // Update approval
      .addCase(updateApproval.pending, (state) => {
        state.updateLoading = true;
        state.updateError = null;
      })
      .addCase(updateApproval.fulfilled, (state, action) => {
        state.updateLoading = false;
        // Remove the approved/rejected item from pending list
        state.pendingApprovals = state.pendingApprovals.filter(
          (approval) => approval._id !== action.payload._id
        );
      })
      .addCase(updateApproval.rejected, (state, action) => {
        state.updateLoading = false;
        state.updateError = action.payload;
      });
  },
});

export const { clearError } = approvalSlice.actions;
export default approvalSlice.reducer;