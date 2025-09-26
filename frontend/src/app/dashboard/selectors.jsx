/**
 * Dashboard selectors
 * @format
 */

const dashboard = (state) => state.dashboardReducer;

export const selectDashboardData = (state) => dashboard(state).dashboardData || {};
