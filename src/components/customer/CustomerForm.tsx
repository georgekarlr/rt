import React, { useState, useEffect } from 'react';
import type { Customer, UpdateCustomerParams, CustomerFormInput } from '../../types/customer';

interface CustomerFormProps {
    initialData?: Customer | null;
    // The form now returns the "Input" type, not the full DB params
    onSave: (data: CustomerFormInput | UpdateCustomerParams) => void;
    onCancel: () => void;
    isSubmitting: boolean;
}

export const CustomerForm: React.FC<CustomerFormProps> = ({
                                                              initialData,
                                                              onSave,
                                                              onCancel,
                                                              isSubmitting
                                                          }) => {
    // Local state for user-editable fields
    const [formData, setFormData] = useState<CustomerFormInput>({
        p_full_name: '',
        p_email: '',
        p_phone: '',
        p_identity_card_no: '',
        p_address: '',
        p_credit_limit: 0
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                p_full_name: initialData.full_name,
                p_email: initialData.email || '',
                p_phone: initialData.phone || '',
                p_identity_card_no: initialData.identity_card_no || '',
                p_address: initialData.address || '',
                p_credit_limit: initialData.credit_limit
            });
        }
    }, [initialData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (initialData) {
            // If updating, we attach the Customer ID
            const updateParams: UpdateCustomerParams = {
                p_customer_id: initialData.id,
                ...formData
            };
            onSave(updateParams);
        } else {
            // If creating, we just pass the raw form data.
            // The PARENT component will inject p_account_id.
            onSave(formData);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 px-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Full Name</label>
                    <input
                        required
                        type="text"
                        className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        value={formData.p_full_name}
                        onChange={e => setFormData({ ...formData, p_full_name: e.target.value })}
                    />
                </div>

                {/* ... (Rest of inputs same as before, mapped to formData fields) ... */}

                <div>
                    <label className="block text-sm font-medium text-gray-700">Credit Limit</label>
                    <input
                        type="number"
                        className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        value={formData.p_credit_limit}
                        onChange={e => setFormData({ ...formData, p_credit_limit: Number(e.target.value) })}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                        type="email"
                        className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        value={formData.p_email}
                        onChange={e => setFormData({ ...formData, p_email: e.target.value })}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                    <input
                        type="text"
                        className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        value={formData.p_phone}
                        onChange={e => setFormData({ ...formData, p_phone: e.target.value })}
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Identity Card No</label>
                    <input
                        type="text"
                        className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        value={formData.p_identity_card_no}
                        onChange={e => setFormData({ ...formData, p_identity_card_no: e.target.value })}
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Address</label>
                    <textarea
                        className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        rows={3}
                        value={formData.p_address}
                        onChange={e => setFormData({ ...formData, p_address: e.target.value })}
                    />
                </div>
            </div>

            <div className="flex justify-end space-x-3 pt-6 border-t mt-4">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                    {isSubmitting ? 'Saving...' : 'Save Customer'}
                </button>
            </div>
        </form>
    );
};