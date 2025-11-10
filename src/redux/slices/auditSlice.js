import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../services/api';

// Async thunk to fetch audit logs
export const fetchAuditLogs = createAsyncThunk(
  'audit/fetchAuditLogs',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const {
        userId,
        action,
        resourceType,
        status,
        startDate,
        endDate,
        page = 1,
        limit = 50
      } = filters;

      const params = new URLSearchParams();
      if (userId) params.append('userId', userId);
      if (action) params.append('action', action);
      if (resourceType) params.append('resourceType', resourceType);
      if (status) params.append('status', status);
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      params.append('page', page);
      params.append('limit', limit);

      const response = await API.get(`/audit-logs?${params.toString()}`);
      return response.data;
    } catch (error) {
      // Handle 404 specifically - backend endpoint not implemented yet
      if (error.response?.status === 404) {
        return rejectWithValue('Audit logging endpoint not yet implemented on backend. Please refer to BACKEND_AUDIT_LOGGING_IMPLEMENTATION.md for implementation guide.');
      }
      return rejectWithValue(error.response?.data?.message || 'Error fetching audit logs');
    }
  }
);

// Async thunk to fetch user activity
export const fetchUserActivity = createAsyncThunk(
  'audit/fetchUserActivity',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await API.get(`/audit-logs/user/${userId}`);
      return response.data;
    } catch (error) {
      // Handle 404 specifically - backend endpoint not implemented yet
      if (error.response?.status === 404) {
        return rejectWithValue('Audit logging endpoint not yet implemented on backend. Please refer to BACKEND_AUDIT_LOGGING_IMPLEMENTATION.md for implementation guide.');
      }
      return rejectWithValue(error.response?.data?.message || 'Error fetching user activity');
    }
  }
);

// Async thunk to export audit logs
export const exportAuditLogs = createAsyncThunk(
  'audit/exportAuditLogs',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const { format = 'csv', startDate, endDate, userId } = filters;

      const params = new URLSearchParams();
      params.append('format', format);
      if (userId) params.append('userId', userId);
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      const response = await API.get(`/audit-logs/export?${params.toString()}`, {
        responseType: 'blob'
      });

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `audit-logs-${Date.now()}.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      return { success: true, message: 'Audit logs exported successfully' };
    } catch (error) {
      // Handle 404 specifically - backend endpoint not implemented yet
      if (error.response?.status === 404) {
        return rejectWithValue('Audit logging export endpoint not yet implemented on backend. Please refer to BACKEND_AUDIT_LOGGING_IMPLEMENTATION.md for implementation guide.');
      }
      return rejectWithValue(error.response?.data?.message || 'Error exporting audit logs');
    }
  }
);

const auditSlice = createSlice({
  name: 'audit',
  initialState: {
    logs: [],
    pagination: {
      page: 1,
      limit: 50,
      total: 0,
      pages: 0
    },
    userActivity: null,
    loading: false,
    exportLoading: false,
    error: null,
    filters: {
      userId: '',
      action: '',
      resourceType: '',
      status: '',
      startDate: '',
      endDate: '',
      page: 1,
      limit: 50
    }
  },
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = {
        userId: '',
        action: '',
        resourceType: '',
        status: '',
        startDate: '',
        endDate: '',
        page: 1,
        limit: 50
      };
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Audit Logs
      .addCase(fetchAuditLogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAuditLogs.fulfilled, (state, action) => {
        state.loading = false;
        state.logs = action.payload.data?.logs || [];
        state.pagination = action.payload.data?.pagination || state.pagination;
      })
      .addCase(fetchAuditLogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch User Activity
      .addCase(fetchUserActivity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserActivity.fulfilled, (state, action) => {
        state.loading = false;
        state.userActivity = action.payload.data;
      })
      .addCase(fetchUserActivity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Export Audit Logs
      .addCase(exportAuditLogs.pending, (state) => {
        state.exportLoading = true;
        state.error = null;
      })
      .addCase(exportAuditLogs.fulfilled, (state) => {
        state.exportLoading = false;
      })
      .addCase(exportAuditLogs.rejected, (state, action) => {
        state.exportLoading = false;
        state.error = action.payload;
      });
  }
});

export const { setFilters, resetFilters, clearError } = auditSlice.actions;
export default auditSlice.reducer;
