import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../services/api";

// Async thunk for fetching dashboard summary
export const fetchSummary = createAsyncThunk(
  "dashboard/fetchSummary",
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get("/analytics/summary");
      return response.data.data || response.data.summary || response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch dashboard summary");
    }
  }
);

// Async thunk for fetching advanced metrics
export const fetchAdvancedMetrics = createAsyncThunk(
  "dashboard/fetchAdvancedMetrics",
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get("/analytics/advanced-metrics");
      return response.data.data || response.data;
    } catch (error) {
      // If endpoint doesn't exist yet, return mock data
      if (error.response?.status === 404) {
        console.log('Advanced metrics endpoint not available yet');
        return {
          dso: { value: 0, description: 'Endpoint not available', status: 'info' },
          paymentAging: [],
          cashFlowForecast: { next30Days: 0, expectedInvoices: 0 },
          revenueTrend: []
        };
      }
      return rejectWithValue(error.response?.data?.message || "Failed to fetch advanced metrics");
    }
  }
);

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: {
    summary: {
      totalHours: 0,
      pendingApprovals: 0,
      approvedInvoices: 0,
      paymentsCollected: 0,
    },
    advancedMetrics: {
      dso: null,
      paymentAging: [],
      cashFlowForecast: null,
      revenueTrend: []
    },
    loading: false,
    metricsLoading: false,
    error: null,
    metricsError: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
      state.metricsError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Summary
      .addCase(fetchSummary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSummary.fulfilled, (state, action) => {
        state.loading = false;
        state.summary = action.payload;
      })
      .addCase(fetchSummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Advanced Metrics
      .addCase(fetchAdvancedMetrics.pending, (state) => {
        state.metricsLoading = true;
        state.metricsError = null;
      })
      .addCase(fetchAdvancedMetrics.fulfilled, (state, action) => {
        state.metricsLoading = false;
        state.advancedMetrics = action.payload;
      })
      .addCase(fetchAdvancedMetrics.rejected, (state, action) => {
        state.metricsLoading = false;
        state.metricsError = action.payload;
      });
  },
});

export const { clearError } = dashboardSlice.actions;
export default dashboardSlice.reducer;