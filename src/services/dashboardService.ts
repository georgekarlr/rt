import { supabase } from '../lib/supabase';
import type { DashboardStats, GetDashboardStatsParams } from '../types/dashboard.ts'; // Assuming types are in a 'types.ts' file

export class DashboardService {
    /**
     * Fetches aggregated dashboard statistics for a specific date range.
     *
     * @param startDate - The start of the period (Date object or ISO string)
     * @param endDate - The end of the period (Date object or ISO string)
     * @returns Promise containing the dashboard statistics object
     */
    static async getStats(startDate: Date | string, endDate: Date | string): Promise<DashboardStats> {

        // Prepare parameters for the RPC call
        const params: GetDashboardStatsParams = {
            p_start_date: typeof startDate === 'string' ? startDate : startDate.toISOString(),
            p_end_date: typeof endDate === 'string' ? endDate : endDate.toISOString(),
        };

        const { data, error } = await supabase
            .rpc('ins_get_dashboard_stats', params);

        if (error) {
            console.error('Error fetching dashboard stats:', error.message);
            throw error;
        }

        // Return data cast to the specific interface
        return data as DashboardStats;
    }
}