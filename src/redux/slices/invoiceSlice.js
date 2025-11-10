import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../services/api";

// Async thunk for generating invoice
export const generateInvoice = createAsyncThunk(
  "invoice/generateInvoice",
  async (invoiceData, { rejectWithValue }) => {
    try {
      const response = await API.post("/invoice/generate", invoiceData);
      return response.data.data || response.data.invoice || response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to generate invoice");
    }
  }
);

// Async thunk for fetching invoices
export const fetchInvoices = createAsyncThunk(
  "invoice/fetchInvoices",
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get("/invoice");
      // Backend returns: { success: true, data: { invoices: [...], summary: {...}, pagination: {...} } }
      const invoices = response.data.data?.invoices || response.data.invoices || response.data || [];
      console.log("Fetched invoices:", invoices);
      return invoices;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch invoices");
    }
  }
);

const invoiceSlice = createSlice({
  name: "invoice",
  initialState: {
    invoices: [],
    loading: false,
    error: null,
    generateLoading: false,
    generateError: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
      state.generateError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch invoices
      .addCase(fetchInvoices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInvoices.fulfilled, (state, action) => {
        state.loading = false;
        state.invoices = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchInvoices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.invoices = []; // Ensure it's always an array
      })
      // Generate invoice
      .addCase(generateInvoice.pending, (state) => {
        state.generateLoading = true;
        state.generateError = null;
      })
      .addCase(generateInvoice.fulfilled, (state, action) => {
        state.generateLoading = false;
        state.invoices.push(action.payload);
      })
      .addCase(generateInvoice.rejected, (state, action) => {
        state.generateLoading = false;
        state.generateError = action.payload;
      });
  },
});

export const { clearError } = invoiceSlice.actions;
export default invoiceSlice.reducer;
