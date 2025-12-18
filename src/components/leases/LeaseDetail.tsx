import React, { useEffect, useState, useMemo } from 'react';
import { LeaseListItem, LeaseScheduleItem } from '../../types/leasesActions';
import { useCurrency } from '../../hooks/useCurrency';
import { formatCurrency } from '../../utils/timezone';
import { User, Home, Calendar, DollarSign, CheckCircle2, AlertCircle } from 'lucide-react';
import {LeasesActionService} from "../../services/leasesActionService.ts";

interface LeaseDetailProps {
    lease: LeaseListItem;
    onRecordPayment: (totalOutstanding: number) => void; // Updated signature
    onTerminate: () => void;
    onExtend: () => void;
}

const LeaseDetail: React.FC<LeaseDetailProps> = ({ lease, onRecordPayment, onTerminate, onExtend }) => {
    const { currency } = useCurrency();
    const [schedule, setSchedule] = useState<LeaseScheduleItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadSchedule = async () => {
            setLoading(true);
            const { data } = await LeasesActionService.getLeaseSchedule(lease.id);
            setSchedule(data || []);
            setLoading(false);
        };
        loadSchedule();
    }, [lease.id]);

    // Calculate total outstanding balance
    const totalOutstanding = useMemo(() => {
        return schedule.reduce((sum, item) => {
            return item.status !== 'voided' ? sum + item.balance : sum;
        }, 0);
    }, [schedule]);

    const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString();

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'paid': return 'bg-green-100 text-green-800';
            case 'partially_paid': return 'bg-orange-100 text-orange-800';
            case 'overdue': return 'bg-red-100 text-red-800';
            case 'voided': return 'bg-gray-100 text-gray-500 line-through';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const isTerminated = lease.status_label.toLowerCase().includes('terminated');

    return (
        <div className="space-y-6">
            {/* Lease Header Info */}
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center">
                        <User className="text-gray-400 mr-2" size={18} />
                        <div>
                            <p className="text-xs text-gray-500 uppercase">Tenant</p>
                            <p className="font-semibold text-gray-900">{lease.tenant_name}</p>
                        </div>
                    </div>
                    <div className="flex items-center">
                        <Home className="text-gray-400 mr-2" size={18} />
                        <div>
                            <p className="text-xs text-gray-500 uppercase">Property</p>
                            <p className="font-semibold text-gray-900">{lease.property_name}</p>
                        </div>
                    </div>
                    <div className="flex items-center">
                        <Calendar className="text-gray-400 mr-2" size={18} />
                        <div>
                            <p className="text-xs text-gray-500 uppercase">Duration</p>
                            <p className="text-sm text-gray-900">
                                {formatDate(lease.start_date)} - {formatDate(lease.end_date)}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center">
                        <DollarSign className="text-gray-400 mr-2" size={18} />
                        <div>
                            <p className="text-xs text-gray-500 uppercase">Rent</p>
                            <p className="text-sm font-semibold text-gray-900">
                                {formatCurrency(lease.rent_amount, currency)} / {lease.payment_frequency}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Primary Actions */}
                {!isTerminated && (
                    <div className="mt-6 pt-4 border-t border-gray-200 flex flex-wrap gap-3 justify-end">
                        <button
                            onClick={onExtend}
                            className="px-3 py-2 text-sm text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg font-medium transition-colors"
                        >
                            Extend Lease
                        </button>
                        <button
                            onClick={onTerminate}
                            className="px-3 py-2 text-sm text-red-600 bg-red-50 hover:bg-red-100 rounded-lg font-medium transition-colors"
                        >
                            Terminate
                        </button>
                        <button
                            onClick={() => onRecordPayment(totalOutstanding)}
                            className="px-4 py-2 text-sm text-white bg-green-600 hover:bg-green-700 rounded-lg font-medium shadow-sm transition-colors flex items-center"
                        >
                            <DollarSign size={16} className="mr-1" /> Record Payment
                        </button>
                    </div>
                )}
            </div>

            {/* Total Balance Indicator */}
            {totalOutstanding > 0 && !isTerminated && (
                <div className="flex items-center bg-orange-50 border border-orange-100 p-3 rounded-lg text-sm text-orange-800">
                    <AlertCircle size={18} className="mr-2" />
                    <span>Total Outstanding Balance: <strong>{formatCurrency(totalOutstanding, currency)}</strong></span>
                </div>
            )}

            {/* Rent Schedule Table */}
            <div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">Rent Schedule</h3>
                {loading ? (
                    <div className="flex justify-center py-8"><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div></div>
                ) : (
                    <div className="border border-gray-200 rounded-lg overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50 text-xs font-medium text-gray-500 uppercase">
                            <tr>
                                <th className="px-4 py-3 text-left whitespace-nowrap">Due Date</th>
                                <th className="px-4 py-3 text-left whitespace-nowrap">Status</th>
                                <th className="px-4 py-3 text-right whitespace-nowrap">Amount</th>
                                <th className="px-4 py-3 text-right whitespace-nowrap">Paid</th>
                                <th className="px-4 py-3 text-right whitespace-nowrap">Balance</th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200 text-sm">
                            {schedule.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 text-gray-900 whitespace-nowrap">{formatDate(item.due_date)}</td>
                                    <td className="px-4 py-3 whitespace-nowrap">
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold capitalize ${getStatusBadge(item.status)}`}>
                                                {item.status.replace('_', ' ')}
                                            </span>
                                    </td>
                                    <td className="px-4 py-3 text-right text-gray-500 whitespace-nowrap">{formatCurrency(item.amount_due, currency)}</td>
                                    <td className="px-4 py-3 text-right text-gray-500 whitespace-nowrap">{formatCurrency(item.total_paid, currency)}</td>
                                    <td className="px-4 py-3 text-right font-medium text-gray-900 whitespace-nowrap">
                                        {formatCurrency(item.balance, currency)}
                                        {item.status === 'paid' && <CheckCircle2 size={14} className="text-green-500 inline ml-2" />}
                                    </td>
                                </tr>
                            ))}
                            {schedule.length === 0 && (
                                <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-500">No schedule generated.</td></tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LeaseDetail;