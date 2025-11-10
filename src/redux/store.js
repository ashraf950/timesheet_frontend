import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import timesheetReducer from "./slices/timesheetSlice";
import approvalReducer from "./slices/approvalSlice";
import invoiceReducer from "./slices/invoiceSlice";
import paymentReducer from "./slices/paymentSlice";
import dashboardReducer from "./slices/dashboardSlice";
import auditReducer from "./slices/auditSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    timesheet: timesheetReducer,
    approval: approvalReducer,
    invoice: invoiceReducer,
    payment: paymentReducer,
    dashboard: dashboardReducer,
    audit: auditReducer,
  },
});
