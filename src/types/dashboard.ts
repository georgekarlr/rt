// types/dashboard.ts

// --- Generic Response Wrapper ---
export interface ServiceResponse<T> {
    data: T | null;
    error: string | null;
}

// --- Nested JSON Structures ---

export interface ExpiringLease {
    lease_id: string; // Changed from id: number to lease_id: string (UUID)
    property_name: string;
    tenant_name: string;
    end_date: string; // ISO Date String
    status_label: string; // Added status_label
}

export interface OverduePayment {
    schedule_id: string; // Changed from id: number to schedule_id: string (UUID)
    lease_id: string; // Added lease_id
    property_name: string;
    tenant_name: string;
    due_date: string; // ISO Date String
    amount_due: number;
    balance: number;
}

// --- Main Return Object ---

export interface DashboardStats {
    // Occupancy Stats
    total_properties: number;
    occupied_count: number;
    vacant_count: number;
    occupancy_rate: number; // Percentage

    // Financial Stats
    expected_revenue: number;
    collected_revenue: number;
    outstanding_balance: number;

    // Alerts
    expiring_leases_count: number;
    expiring_leases_data: ExpiringLease[];

    overdue_count: number;
    overdue_data: OverduePayment[];
}

// --- Parameter Interface ---

export interface GetDashboardStatsParams {
    p_start_date: string; // ISO Timestamp e.g., '2023-01-01T00:00:00'
    p_end_date: string;   // ISO Timestamp
}