// services/dashboardService.ts
import { supabase } from '../lib/supabase';
import type {
    DashboardStats,
    GetDashboardStatsParams,
    ServiceResponse
} from '../types/dashboard';

export class DashboardService {

    /**
     * Fetches high-level statistics for the Rent Management Dashboard.
     * Aggregates occupancy, financials, lease expirations, and overdue payments.
     *
     * @param params - Date range for the financial calculations.
     * @returns ServiceResponse containing the stats object.
     */
    static async getStats(params: GetDashboardStatsParams): Promise<ServiceResponse<DashboardStats>> {
        try {
            const { data, error } = await supabase.rpc('rt_get_dashboard_stats', {
                p_start_date: params.p_start_date,
                p_end_date: params.p_end_date
            });

            if (error) {
                return { data: null, error: error.message };
            }

            // The function uses RETURNS TABLE, so Supabase returns an array of rows.
            // Since the logic aggregates everything into a single row, we take the first item.
            if (!data || data.length === 0) {
                return { data: null, error: 'No dashboard data available.' };
            }

            return { data: data[0] as DashboardStats, error: null };

        } catch (err: any) {
            return {
                data: null,
                error: err.message || 'An unexpected error occurred while fetching dashboard stats.'
            };
        }
    }
}