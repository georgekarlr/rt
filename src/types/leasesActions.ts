// types/leasesActions.ts

// --- Generic Response Wrapper ---
export interface ServiceResponse<T> {
    data: T | null;
    error: string | null;
}

// --- Enum Types ---
export type FrequencyType = 'minute' | 'hour' | 'day' | 'week' | 'month' | 'year';
export type ScheduleStatus = 'pending' | 'paid' | 'partially_paid' | 'overdue' | 'voided';

// Valid status filters for searching leases
export type LeaseStatusFilter = 'active' | 'terminated' | 'expiring' | null;

// --- Entity Types ---

export interface LeaseListItem {
    id: number;
    property_name: string;
    tenant_name: string;
    start_date: string; // ISO Timestamp
    end_date: string;   // ISO Timestamp
    rent_amount: number;
    payment_frequency: FrequencyType;
    total_paid: number;
    status_label: string; // Computed label (e.g., 'Expiring Soon', 'Terminated')
}

export interface LeaseScheduleItem {
    id: number;
    period_start: string; // ISO Timestamp
    due_date: string;     // ISO Timestamp
    amount_due: number;
    total_paid: number;
    balance: number;
    status: ScheduleStatus;
}

// --- Parameter Interfaces ---

export interface GetLeasesListParams {
    p_search?: string | null; // Search term (Property Name or Tenant Name)
    p_status?: LeaseStatusFilter;
}

export interface ProcessAutomaticPaymentParams {
    p_lease_id: number;
    p_total_amount: number;
    p_payment_method: string;
    p_notes?: string | null;
    p_created_at?: string; // ISO Timestamp (for backdating)
}

export interface TerminateLeaseParams {
    p_lease_id: number;
    p_reason?: string;
}

export interface ExtendLeaseParams {
    p_lease_id: number;
    p_new_end_date: string; // ISO Timestamp
}