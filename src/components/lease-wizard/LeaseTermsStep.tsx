import React from 'react';
import { Property } from '../../types/properties';
import { Tenant } from '../../types/tenants';
import { FrequencyType } from '../../types/leases';
import {
  Calendar,
  Clock,
  DollarSign,
  Hash,
  Building2,
  User,
  ArrowRight,
  Calculator,
  Repeat
} from 'lucide-react';

type FrequencyOption = { label: string; value: FrequencyType };

type Props = {
  property: Property | null;
  tenant: Tenant | null;
  startDate: string;
  endDate: string;
  paymentCount: string;
  rentAmount: string;
  frequency: FrequencyType;
  frequencyOptions: FrequencyOption[];
  onChange: {
    setStartDate: (v: string) => void;
    setEndDate: (v: string) => void;
    setPaymentCount: (v: string) => void;
    setRentAmount: (v: string) => void;
    setFrequency: (v: FrequencyType) => void;
  };
};

const LeaseTermsStep: React.FC<Props> = ({
                                           property,
                                           tenant,
                                           startDate,
                                           endDate,
                                           paymentCount,
                                           rentAmount,
                                           frequency,
                                           frequencyOptions,
                                           onChange,
                                         }) => {
  return (
      <div className="animate-in fade-in duration-500">
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900">Lease Terms</h2>
          <p className="text-sm text-gray-500 mt-1">Define the duration, cost, and schedule for this agreement.</p>
        </div>

        {/* Summary Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 flex items-start gap-3">
            <div className="p-2 bg-white rounded-lg shadow-sm text-gray-600">
              <Building2 size={20} />
            </div>
            <div>
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Property</span>
              {property ? (
                  <>
                    <div className="font-semibold text-gray-900 mt-0.5">{property.name}</div>
                    <div className="text-sm text-gray-600 truncate max-w-[200px]">{property.address}</div>
                  </>
              ) : (
                  <div className="text-sm text-gray-400 italic mt-1">Not selected</div>
              )}
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 flex items-start gap-3">
            <div className="p-2 bg-white rounded-lg shadow-sm text-gray-600">
              <User size={20} />
            </div>
            <div>
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Tenant</span>
              {tenant ? (
                  <>
                    <div className="font-semibold text-gray-900 mt-0.5">{tenant.full_name}</div>
                    <div className="text-sm text-gray-600">{tenant.email || 'No email provided'}</div>
                  </>
              ) : (
                  <div className="text-sm text-gray-400 italic mt-1">Not selected</div>
              )}
            </div>
          </div>
        </div>

        <hr className="border-gray-100 mb-8" />

        {/* Form Section */}
        <div className="space-y-6">

          {/* Date Row */}
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 items-end">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">Start Date</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                  <Calendar size={18} />
                </div>
                <input
                    type="datetime-local"
                    className="w-full pl-10 pr-3 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-sm"
                    value={startDate}
                    onChange={(e) => onChange.setStartDate(e.target.value)}
                />
              </div>
            </div>

            <div className="hidden md:flex items-center justify-center pb-3 text-gray-400">
              <ArrowRight size={24} />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="block text-sm font-medium text-gray-700">End Date</label>
                <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                <Calculator size={10} /> Auto
              </span>
              </div>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                  <Clock size={18} />
                </div>
                <input
                    type="datetime-local"
                    className="w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-200 text-gray-500 rounded-lg cursor-not-allowed focus:outline-none"
                    value={endDate}
                    onChange={(e) => onChange.setEndDate(e.target.value)}
                    readOnly
                />
              </div>
            </div>
          </div>

          {/* Financials Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">Billing Frequency</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                  <Repeat size={18} />
                </div>
                <select
                    className="w-full pl-10 pr-3 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-sm appearance-none"
                    value={frequency}
                    onChange={(e) => onChange.setFrequency(e.target.value as FrequencyType)}
                >
                  {frequencyOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">Duration (Count)</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                  <Hash size={18} />
                </div>
                <input
                    type="number"
                    min="1"
                    step="1"
                    className="w-full pl-10 pr-3 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-sm"
                    placeholder="e.g. 12"
                    value={paymentCount}
                    onChange={(e) => onChange.setPaymentCount(e.target.value)}
                />
              </div>
              <p className="text-xs text-gray-500 pl-1">Total payments to be made</p>
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">Rent Amount</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                  <DollarSign size={18} />
                </div>
                <input
                    type="number"
                    min="0"
                    step="0.01"
                    className="w-full pl-10 pr-3 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-sm font-medium"
                    placeholder="0.00"
                    value={rentAmount}
                    onChange={(e) => onChange.setRentAmount(e.target.value)}
                />
              </div>
              <p className="text-xs text-gray-500 pl-1">Per {frequency}</p>
            </div>

          </div>
        </div>
      </div>
  );
};

export default LeaseTermsStep;