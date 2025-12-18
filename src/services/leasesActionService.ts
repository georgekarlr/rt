// services/LeasesActionService.ts
import { supabase } from '../lib/supabase';
import type {
    LeaseListItem,
    LeaseScheduleItem,
    GetLeasesListParams,
    ProcessAutomaticPaymentParams,
    TerminateLeaseParams,
    ExtendLeaseParams,
    ServiceResponse
} from '../types/leasesActions';
import {getCurrentDate} from "../utils/datetime.ts";

export class LeasesActionService {

    /**
     * Fetches a list of leases filtered by search term and status.
     */
    static async getLeasesList(params: GetLeasesListParams = {}): Promise<ServiceResponse<LeaseListItem[]>> {
        try {
            const { data, error } = await supabase.rpc('rt_get_leases_list', {
                p_search: params.p_search ?? null,
                p_status: params.p_status ?? null
            });

            if (error) {
                return { data: null, error: error.message };
            }

            return { data: data as LeaseListItem[], error: null };

        } catch (err: any) {
            return {
                data: null,
                error: err.message || 'An unexpected error occurred while fetching the leases list.'
            };
        }
    }

    /**
     * Retrieves the rent payment schedule for a specific lease.
     */
    static async getLeaseSchedule(leaseId: number): Promise<ServiceResponse<LeaseScheduleItem[]>> {
        try {
            const { data, error } = await supabase.rpc('rt_get_lease_schedule', {
                p_lease_id: leaseId
            });

            if (error) {
                return { data: null, error: error.message };
            }

            return { data: data as LeaseScheduleItem[], error: null };

        } catch (err: any) {
            return {
                data: null,
                error: err.message || 'An unexpected error occurred while fetching the lease schedule.'
            };
        }
    }

    /**
     * Processes a bulk payment for a lease.
     * Logic: Automatically distributes the money to the oldest unpaid rent schedules first.
     */
    static async processAutomaticPayment(params: ProcessAutomaticPaymentParams): Promise<ServiceResponse<void>> {
        try {
            const { error } = await supabase.rpc('rt_process_automatic_payment', {
                p_lease_id: params.p_lease_id,
                p_total_amount: params.p_total_amount,
                p_payment_method: params.p_payment_method,
                p_notes: params.p_notes ?? null,
                p_created_at: getCurrentDate()
            });

            if (error) {
                return { data: null, error: error.message };
            }

            return { data: null, error: null };

        } catch (err: any) {
            return {
                data: null,
                error: err.message || 'An unexpected error occurred while processing the automatic payment.'
            };
        }
    }

    /**
     * Terminates a lease early.
     * Sets end date to now, voids future pending payments, and marks property as vacant.
     */
    static async terminateLease(params: TerminateLeaseParams): Promise<ServiceResponse<void>> {
        try {
            const { error } = await supabase.rpc('rt_terminate_lease', {
                p_lease_id: params.p_lease_id,
                p_reason: params.p_reason ?? 'Early Termination'
            });

            if (error) {
                return { data: null, error: error.message };
            }

            return { data: null, error: null };

        } catch (err: any) {
            return {
                data: null,
                error: err.message || 'An unexpected error occurred while terminating the lease.'
            };
        }
    }

    /**
     * Extends the end date of an existing lease.
     * Automatically generates new rent schedule items for the extended period.
     */
    static async extendLease(params: ExtendLeaseParams): Promise<ServiceResponse<void>> {
        try {
            const { error } = await supabase.rpc('rt_extend_lease', {
                p_lease_id: params.p_lease_id,
                p_new_end_date: params.p_new_end_date
            });

            if (error) {
                return { data: null, error: error.message };
            }

            return { data: null, error: null };

        } catch (err: any) {
            return {
                data: null,
                error: err.message || 'An unexpected error occurred while extending the lease.'
            };
        }
    }
}