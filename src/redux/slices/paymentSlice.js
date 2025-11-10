import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../services/api";

// Async thunk for reconciling payment
export const reconcilePayment = createAsyncThunk(
  "payment/reconcilePayment",
  async (paymentData, { rejectWithValue }) => {
    try {
      const response = await API.post("/payment/reconcile", paymentData);
      return response.data.data || response.data.payment || response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to reconcile payment");
    }
  }
);

// Async thunk for fetching payments
export const fetchPayments = createAsyncThunk(
  "payment/fetchPayments",
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get("/payment");
      // Backend returns { success, data: { payments, summary, pagination } }
      return response.data.data?.payments || response.data.payments || [];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch payments");
    }
  }
);

const paymentSlice = createSlice({
  name: "payment",
  initialState: {
    payments: [],
    summary: null,
    pagination: null,
    loading: false,
    error: null,
    reconcileLoading: false,
    reconcileError: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
      state.reconcileError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch payments
      .addCase(fetchPayments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPayments.fulfilled, (state, action) => {
        state.loading = false;
        state.payments = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchPayments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.payments = []; // Ensure it's always an array
      })
      // Reconcile payment
      .addCase(reconcilePayment.pending, (state) => {
        state.reconcileLoading = true;
        state.reconcileError = null;
      })
      .addCase(reconcilePayment.fulfilled, (state, action) => {
        state.reconcileLoading = false;
        // Update the payment in the list
        const index = state.payments.findIndex(payment => payment._id === action.payload._id);
        if (index !== -1) {
          state.payments[index] = action.payload;
        }
      })
      .addCase(reconcilePayment.rejected, (state, action) => {
        state.reconcileLoading = false;
        state.reconcileError = action.payload;
      });
  },
});

export const { clearError } = paymentSlice.actions;
export default paymentSlice.reducer;
