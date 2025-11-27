// types.ts

/**
 * Represents the Customer entity returned from the database.
 */
export interface Customer {
    id: number;
    account_id: number;
    user_id: string; // UUID
    full_name: string;
    phone: string | null;
    email: string | null;
    identity_card_no: string | null;
    address: string | null;
    credit_limit: number;
    created_at: string; // ISO timestamp
}

/**
 * Input parameters for searching customers.
 */
export interface GetCustomersParams {
    p_search_term?: string;
    p_limit?: number;
    p_offset?: number;
}

/**
 * Input parameters for creating a new customer.
 */
export interface CreateCustomerParams {
    p_account_id: number;
    p_full_name: string;
    p_phone?: string;
    p_email?: string;
    p_identity_card_no?: string;
    p_address?: string;
    p_credit_limit?: number;
    p_created_at?: string;
}

/**
 * Input parameters for updating an existing customer.
 */
export interface UpdateCustomerParams {
    p_customer_id: number;
    p_full_name?: string;
    p_phone?: string;
    p_email?: string;
    p_identity_card_no?: string;
    p_address?: string;
    p_credit_limit?: number;
}

/**
 * Helper type for the Form component.
 * The user fills these out, but the System supplies p_account_id.
 */
export type CustomerFormInput = Omit<CreateCustomerParams, 'p_account_id' | 'p_created_at'>;