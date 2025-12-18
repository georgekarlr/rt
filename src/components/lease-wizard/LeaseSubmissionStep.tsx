import React from 'react';
import { Property } from '../../types/properties';
import { Tenant } from '../../types/tenants';
import { FrequencyType } from '../../types/leases';

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
      <div className="space-y-6">
        {/* Success Message Header */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Created</h2>
          <p className="text-gray-500 mb-4">Your lease was created successfully.</p>

          <div className="p-4 border rounded-lg bg-green-50 border-green-200 text-green-800">
            {createdLeaseId ? (
                <div className="font-medium">Lease created successfully! ID: {createdLeaseId}</div>
            ) : (
                <div className="font-medium">Lease creation completed.</div>
            )}
          </div>
        </div>

        {/* New: Lease Details Summary */}
        <div className="border-t pt-6">
          <h3 className="text-md font-medium text-gray-900 mb-4">Lease Summary</h3>

          <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
            {/* Property Details */}
            <div>
              <dt className="text-sm font-medium text-gray-500">Property</dt>
              <dd className="mt-1 text-sm text-gray-900 font-medium">
                {property?.name || 'Unknown Property'}
              </dd>
            </div>

            {/* Tenant Details */}
            <div>
              <dt className="text-sm font-medium text-gray-500">Tenant</dt>
              <dd className="mt-1 text-sm text-gray-900 font-medium">
                {tenant?.full_name || 'Unknown Tenant'}
              </dd>
            </div>

            {/* Date Range */}
            <div>
              <dt className="text-sm font-medium text-gray-500">Start Date</dt>
              <dd className="mt-1 text-sm text-gray-900">{startDate}</dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">End Date</dt>
              <dd className="mt-1 text-sm text-gray-900">{endDate}</dd>
            </div>

            {/* Payment Details */}
            <div>
              <dt className="text-sm font-medium text-gray-500">Rent Amount</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {/* Assuming rentAmount is a number string, adding currency symbol purely for display */}
                ${rentAmount}
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">Payment Frequency</dt>
              <dd className="mt-1 text-sm text-gray-900 capitalize">{frequency}</dd>
            </div>
          </dl>
        </div>
      </div>
  );
};

export default LeaseSubmissionStep;