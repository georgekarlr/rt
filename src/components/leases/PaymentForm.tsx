import React, { useState } from 'react';
import { useCurrency } from '../../hooks/useCurrency';
import { formatCurrency } from '../../utils/timezone';
import { DollarSign, CheckCircle2, CalendarClock } from 'lucide-react';
import {LeaseListItem, ProcessAutomaticPaymentParams} from "../../types/leasesActions.ts";

interface PaymentFormProps {
    lease: LeaseListItem;
    suggestedAmount?: number; // Total outstanding balance passed from detail view
    onSubmit: (params: ProcessAutomaticPaymentParams) => Promise<void>;
    onCancel: () => void;
    isSubmitting: boolean;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ lease, suggestedAmount = 0, onSubmit, onCancel, isSubmitting }) => {
    const { currency } = useCurrency();

    // Helper for datetime-local
    const getCurrentLocalTime = () => {
        const now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        return now.toISOString().slice(0, 16);
    };

    const [amount, setAmount] = useState(suggestedAmount > 0 ? suggestedAmount.toString() : '');
    const [method, setMethod] = useState('Cash');
    const [transactionDate, setTransactionDate] = useState(getCurrentLocalTime());
    const [notes, setNotes] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            p_lease_id: lease.id,
            p_total_amount: parseFloat(amount),
            p_payment_method: method,
            p_created_at: transactionDate.replace('T', ' '),
            p_notes: notes
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Info Banner */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <div className="flex justify-between items-center text-sm mb-1">
                    <span className="text-blue-800 font-medium">Payment for:</span>
                    <span className="text-blue-900 font-bold">{lease.tenant_name}</span>
                </div>
                {suggestedAmount > 0 && (
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-blue-800">Total Outstanding:</span>
                        <span className="font-bold text-blue-900 text-lg">{formatCurrency(suggestedAmount, currency)}</span>
                    </div>
                )}
                <p className="text-xs text-blue-600 mt-2">
                    Payment will be automatically distributed to the oldest unpaid rent schedules first.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Amount */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Total Amount</label>
                    <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                        <input
                            type="number"
                            step="0.01"
                            min="0.01"
                            required
                            className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 outline-none"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="0.00"
                        />
                    </div>
                </div>

                {/* Date */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Transaction Date</label>
                    <div className="relative">
                        <CalendarClock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                        <input
                            type="datetime-local"
                            required
                            className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 outline-none bg-white"
                            value={transactionDate}
                            onChange={(e) => setTransactionDate(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Method */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 outline-none bg-white"
                    value={method}
                    onChange={(e) => setMethod(e.target.value)}
                >
                    <option value="Cash">Cash</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Check">Check</option>
                    <option value="Credit Card">Credit Card</option>
                    <option value="Other">Other</option>
                </select>
            </div>

            {/* Notes */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes (Optional)</label>
                <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 outline-none"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Ref No, Transaction ID..."
                />
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 text-sm text-white bg-green-600 hover:bg-green-700 rounded-lg disabled:opacity-50 flex items-center shadow-sm"
                >
                    <CheckCircle2 size={16} className="mr-2" />
                    {isSubmitting ? 'Processing...' : 'Process Payment'}
                </button>
            </div>
        </form>
    );
};

export default PaymentForm;