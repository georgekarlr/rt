/**
 * Represents the input parameters for the 'get_dashboard_stats' RPC function.
 * PostgreSQL timestamps should be passed as ISO 8601 strings.
 */
export interface GetDashboardStatsParams {
    p_start_date: string;
    p_end_date: string;
}

/**
 * Represents the JSON return value from the 'get_dashboard_stats' function.
 */
export interface DashboardStats {
    /** Gross Revenue generated in this period */
    period_sales: number;

    /** Actual money in the drawer for this period (Down payments + Installments) */
    period_cash_collected: number;

    /** Money lost in this period via refunds */
    period_refunds: number;

    /** Installments falling due in this period (Expected collections) */
    period_installments_due: number;

    /** Global: Total Active Debt (Money owed to store right now) */
    global_outstanding_debt: number;

    /** Global: Count of Overdue Loans (Alerts) */
    global_overdue_count: number;
}