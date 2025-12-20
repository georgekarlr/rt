import React from 'react';
import { Property } from '../../types/properties';
import { Tenant } from '../../types/tenants';
import { FrequencyType } from '../../types/leases';
import {
    CheckCircle2,
    Building2,
    User,
    Calendar,
    Wallet,
    FileText,
    Clock
} from 'lucide-react';

type Props = {
    createdLeaseId: number | null;
    property: Property | null;
    tenant: Tenant | null;
    startDate: string;
    endDate: string;
    rentAmount: string;
    frequency: FrequencyType;
};

const LeaseSubmissionStep: React.FC<Props> = ({
                                                  createdLeaseId,
                                                  property,
                                                  tenant,
                                                  startDate,
                                                  endDate,
                                                  rentAmount,
                                                  frequency,
                                              }) => {
    return (
        <div className="animate-in fade-in zoom-in duration-500 py-4">

            {/* Success Hero Section */}
            <div className="text-center mb-10">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 text-green-600 mb-6 shadow-sm">
                    <CheckCircle2 size={40} className="animate-in zoom-in duration-700 delay-150" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Lease Successfully Created!</h2>
                <p className="text-gray-500 max-w-md mx-auto">
                    The lease agreement has been finalized and saved to the system.
                </p>

                {/* Lease ID Badge */}
                <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-full text-sm text-gray-600">
                    <FileText size={16} className="text-blue-500" />
                    <span>Lease ID:</span>
                    {createdLeaseId ? (
                        <span className="font-mono font-bold text-gray-900">#{createdLeaseId}</span>
                    ) : (
                        <span className="italic text-gray-400">Pending...</span>
                    )}
                </div>
            </div>

            {/* Summary Card */}
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="bg-gray-50/50 px-6 py-4 border-b border-gray-100">
                    <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Agreement Summary</h3>
                </div>

                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">

                    {/* Property */}
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg shrink-0">
                            <Building2 size={20} />
                        </div>
                        <div>
                            <dt className="text-xs font-medium text-gray-500 uppercase">Property</dt>
                            <dd className="mt-0.5 text-base font-semibold text-gray-900">
                                {property?.name || 'Unknown Property'}
                            </dd>
                            <dd className="text-sm text-gray-500 line-clamp-1">{property?.address}</dd>
                        </div>
                    </div>

                    {/* Tenant */}
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-purple-50 text-purple-600 rounded-lg shrink-0">
                            <User size={20} />
                        </div>
                        <div>
                            <dt className="text-xs font-medium text-gray-500 uppercase">Tenant</dt>
                            <dd className="mt-0.5 text-base font-semibold text-gray-900">
                                {tenant?.full_name || 'Unknown Tenant'}
                            </dd>
                            <dd className="text-sm text-gray-500">{tenant?.email || 'No email provided'}</dd>
                        </div>
                    </div>

                    {/* Timeline */}
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-orange-50 text-orange-600 rounded-lg shrink-0">
                            <Calendar size={20} />
                        </div>
                        <div className="w-full">
                            <dt className="text-xs font-medium text-gray-500 uppercase">Duration</dt>
                            <div className="mt-1 flex items-center justify-between text-sm">
                                <div className="font-medium text-gray-900">
                                    {startDate.replace('T', ' ')}
                                </div>
                                <div className="px-2 text-gray-400">→</div>
                                <div className="font-medium text-gray-900">
                                    {endDate.replace('T', ' ')}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Financials */}
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-green-50 text-green-600 rounded-lg shrink-0">
                            <Wallet size={20} />
                        </div>
                        <div>
                            <dt className="text-xs font-medium text-gray-500 uppercase">Payment Terms</dt>
                            <dd className="mt-0.5 flex items-baseline gap-1">
                                <span className="text-lg font-bold text-gray-900">${rentAmount}</span>
                                <span className="text-sm text-gray-500 font-medium capitalize">/ {frequency}</span>
                            </dd>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default LeaseSubmissionStep;