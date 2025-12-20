import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PropertiesService } from '../services/propertiesService';
import { TenantsService } from '../services/tenantsService';
import { LeasesService } from '../services/leasesService';
import type { Property } from '../types/properties';
import type { Tenant } from '../types/tenants';
import type { CreateLeaseParams, FrequencyType } from '../types/leases';
// Added ChevronLeft/Right/RotateCw for better button UI
import { Calendar, CheckCircle2, Home, Loader2, User, ChevronRight, ChevronLeft, AlertCircle, RotateCw, List } from 'lucide-react';
import { SelectPropertyStep, SelectTenantStep, LeaseTermsStep, LeaseSubmissionStep } from '../components/lease-wizard';
import { getCurrentDate } from "../utils/datetime.ts";

type WizardStep = 1 | 2 | 3 | 4;

const frequencyOptions: { label: string; value: FrequencyType }[] = [
  { label: 'Minute', value: 'minute' },
  { label: 'Hour', value: 'hour' },
  { label: 'Day', value: 'day' },
  { label: 'Week', value: 'week' },
  { label: 'Month', value: 'month' },
  { label: 'Year', value: 'year' },
];

const LeaseWizard: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<WizardStep>(1);

  // Data loading
  const [properties, setProperties] = useState<Property[]>([]);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loadingProps, setLoadingProps] = useState(false);
  const [loadingTenants, setLoadingTenants] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Selections
  const [selectedPropertyId, setSelectedPropertyId] = useState<number | null>(null);
  const [selectedTenantId, setSelectedTenantId] = useState<number | null>(null);

  // Terms
  const [startDate, setStartDate] = useState(''); // datetime-local string
  const [endDate, setEndDate] = useState('');     // datetime-local string
  const [paymentCount, setPaymentCount] = useState<string>('');
  const [rentAmount, setRentAmount] = useState('');
  const [frequency, setFrequency] = useState<FrequencyType>('month');

  // Submission
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [createdLeaseId, setCreatedLeaseId] = useState<number | null>(null);

  // Reset wizard selections/inputs (but not createdLeaseId)
  const resetForm = () => {
    setSelectedPropertyId(null);
    setSelectedTenantId(null);
    setStartDate('');
    setEndDate('');
    setPaymentCount('');
    setRentAmount('');
    setFrequency('month');
  };

  useEffect(() => {
    // Load properties and tenants up-front
    const load = async () => {
      setLoadError(null);
      setLoadingProps(true);
      const propsRes = await PropertiesService.getProperties();
      setLoadingProps(false);
      if (propsRes.error) {
        setLoadError(propsRes.error);
      } else {
        setProperties(propsRes.data || []);
      }

      setLoadingTenants(true);
      const tenantsRes = await TenantsService.getTenants();
      setLoadingTenants(false);
      if (tenantsRes.error) {
        setLoadError((prev) => prev ?? tenantsRes.error);
      } else {
        setTenants(tenantsRes.data || []);
      }
    };
    load();
  }, []);

  const selectedProperty = useMemo(
      () => properties.find((p) => p.id === selectedPropertyId) || null,
      [properties, selectedPropertyId]
  );
  const selectedTenant = useMemo(
      () => tenants.find((t) => t.id === selectedTenantId) || null,
      [tenants, selectedTenantId]
  );

  const canGoNext = useMemo(() => {
    if (step === 1) return selectedPropertyId !== null;
    if (step === 2) return selectedTenantId !== null;
    if (step === 3) {
      const amount = Number(rentAmount);
      const count = Number(paymentCount);
      const isInt = Number.isInteger(count) && count >= 1;
      return (
          !!startDate &&
          !!endDate &&
          !Number.isNaN(amount) &&
          amount > 0 &&
          !!frequency &&
          isInt
      );
    }
    return true;
  }, [step, selectedPropertyId, selectedTenantId, startDate, endDate, rentAmount, frequency, paymentCount]);

  // Utilities for date arithmetic
  function toDate(d: string): Date | null {
    if (!d) return null;
    const dt = new Date(d);
    return Number.isNaN(dt.getTime()) ? null : dt;
  }

  function toDatetimeLocal(d: Date): string {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  }

  function addMonths(date: Date, months: number): Date {
    const d = new Date(date.getTime());
    const day = d.getDate();
    d.setDate(1);
    d.setMonth(d.getMonth() + months);
    const lastDay = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
    d.setDate(Math.min(day, lastDay));
    return d;
  }

  function addYears(date: Date, years: number): Date {
    return addMonths(date, years * 12);
  }

  function addDays(date: Date, days: number): Date {
    const d = new Date(date.getTime());
    d.setDate(d.getDate() + days);
    return d;
  }

  function addMinutes(date: Date, minutes: number): Date {
    const d = new Date(date.getTime());
    d.setMinutes(d.getMinutes() + minutes);
    return d;
  }

  function addHours(date: Date, hours: number): Date {
    return addMinutes(date, hours * 60);
  }

  function addWeeks(date: Date, weeks: number): Date {
    return addDays(date, weeks * 7);
  }

  function calculateEndDate(start: string, freq: FrequencyType, countStr: string): string {
    const startDt = toDate(start);
    const count = Number(countStr);
    if (!startDt || !Number.isFinite(count) || count < 1) return '';

    let endExclusive: Date;
    switch (freq) {
      case 'minute':
        endExclusive = addMinutes(startDt, count);
        break;
      case 'hour':
        endExclusive = addHours(startDt, count);
        break;
      case 'day':
        endExclusive = addDays(startDt, count);
        break;
      case 'week':
        endExclusive = addWeeks(startDt, count);
        break;
      case 'month':
        endExclusive = addMonths(startDt, count);
        break;
      case 'year':
        endExclusive = addYears(startDt, count);
        break;
      default:
        endExclusive = addMonths(startDt, count);
    }
    const inclusive = new Date(endExclusive.getTime() - 1);
    return toDatetimeLocal(inclusive);
  }

  useEffect(() => {
    const calculated = calculateEndDate(startDate, frequency, paymentCount);
    setEndDate(calculated);
  }, [startDate, frequency, paymentCount]);


  const handleSubmit = async () => {
    if (!selectedPropertyId || !selectedTenantId) return;

    setSubmitting(true);
    setSubmitError(null);
    const params: CreateLeaseParams = {
      p_property_id: selectedPropertyId,
      p_tenant_id: selectedTenantId,
      p_start_date: startDate.replace('T', ' '),
      p_end_date: endDate.replace('T', ' '),
      p_rent_amount: Number(rentAmount),
      p_frequency: frequency,
      p_created_at: getCurrentDate(),
    };


    const res = await LeasesService.createLease(params);
    setSubmitting(false);
    if (res.error) {
      setSubmitError(res.error);
      return;
    }
    setCreatedLeaseId(res.data || null);
    setStep(4);
  };

  return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Lease Creation Wizard</h1>
            <p className="mt-2 text-sm text-gray-600">Complete the steps below to generate a new lease agreement.</p>
          </div>

          {/* Stepper */}
          <div className="relative mb-12">
            {/* Connecting Line background */}
            <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -translate-y-1/2 rounded-full -z-10" />

            <div className="flex justify-between w-full">
              <StepBadge active={step === 1} completed={step > 1} icon={Home} label="Property" index={1} />
              <StepConnector active={step > 1} />
              <StepBadge active={step === 2} completed={step > 2} icon={User} label="Tenant" index={2} />
              <StepConnector active={step > 2} />
              <StepBadge active={step === 3} completed={step > 3} icon={Calendar} label="Terms" index={3} />
              <StepConnector active={step > 3} />
              <StepBadge active={step === 4} completed={false} icon={CheckCircle2} label="Done" index={4} />
            </div>
          </div>

          {/* Card Content */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            {/* Main Content Area */}
            <div className="p-8 min-h-[400px]">
              {loadError && (
                  <div className="mb-6 p-4 rounded-xl bg-red-50 text-red-700 border border-red-200 flex items-center gap-3">
                    <AlertCircle size={20} />
                    <span>{loadError}</span>
                  </div>
              )}

              <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                {step === 1 && (
                    <SelectPropertyStep
                        properties={properties}
                        loading={loadingProps}
                        selectedId={selectedPropertyId}
                        onSelect={setSelectedPropertyId}
                    />
                )}

                {step === 2 && (
                    <SelectTenantStep
                        tenants={tenants}
                        loading={loadingTenants}
                        selectedId={selectedTenantId}
                        onSelect={setSelectedTenantId}
                    />
                )}

                {step === 3 && (
                    <LeaseTermsStep
                        property={selectedProperty}
                        tenant={selectedTenant}
                        startDate={startDate}
                        endDate={endDate}
                        paymentCount={paymentCount}
                        rentAmount={rentAmount}
                        frequency={frequency}
                        frequencyOptions={frequencyOptions}
                        onChange={{ setStartDate, setEndDate, setPaymentCount, setRentAmount, setFrequency }}
                    />
                )}

                {step === 4 && (
                    <LeaseSubmissionStep
                        createdLeaseId={createdLeaseId}
                        property={selectedProperty}
                        tenant={selectedTenant}
                        startDate={startDate}
                        endDate={endDate}
                        rentAmount={rentAmount}
                        frequency={frequency}
                    />
                )}
              </div>

              {submitError && (
                  <div className="mt-6 p-4 rounded-xl bg-red-50 text-red-700 border border-red-200 flex items-center gap-3">
                    <AlertCircle size={20} />
                    <span>{submitError}</span>
                  </div>
              )}
            </div>

            {/* Footer Navigation */}
            <div className="bg-gray-50 px-8 py-5 border-t border-gray-200 flex items-center justify-between">
              {/* Back Button */}
              <div className="w-32">
                {step < 4 && step > 1 && (
                    <button
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
                        onClick={() => setStep((s) => (s > 1 ? ((s - 1) as WizardStep) : s))}
                        disabled={submitting}
                        type="button"
                    >
                      <ChevronLeft size={16} />
                      Back
                    </button>
                )}
              </div>

              {/* Next / Action Buttons */}
              <div>
                {step < 4 ? (
                    <button
                        className={`
                    flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white rounded-lg shadow-md transition-all
                    ${canGoNext && !submitting ? 'bg-blue-600 hover:bg-blue-700 hover:shadow-blue-600/30 hover:-translate-y-0.5' : 'bg-gray-300 cursor-not-allowed'}
                  `}
                        onClick={() => {
                          if (step === 3) {
                            handleSubmit();
                          } else {
                            setStep((s) => ((s + 1) as WizardStep));
                          }
                        }}
                        disabled={!canGoNext || submitting}
                        type="button"
                    >
                      {submitting && step === 3 ? (
                          <>
                            <Loader2 className="animate-spin" size={18} />
                            Submitting...
                          </>
                      ) : step === 3 ? (
                          <>Create Lease <CheckCircle2 size={18} /></>
                      ) : (
                          <>Next <ChevronRight size={18} /></>
                      )}
                    </button>
                ) : (
                    <div className="flex items-center gap-3">
                      <button
                          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-sm"
                          type="button"
                          onClick={() => {
                            resetForm();
                            navigate('/leases');
                          }}
                      >
                        <List size={16} />
                        Go to listings
                      </button>
                      <button
                          className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-md hover:shadow-blue-600/30 transition-all"
                          type="button"
                          onClick={() => {
                            setCreatedLeaseId(null);
                            resetForm();
                            setStep(1);
                          }}
                      >
                        <RotateCw size={16} />
                        Create Another
                      </button>
                    </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

// --- Sub-components for UI ---

function StepConnector({ active }: { active: boolean }) {
  // This overlay div sits on top of the grey background line in the parent
  // We use absolute positioning to "fill" the space between badges visually
  // Note: simpler approach is just to rely on the parent line, but if we want color progression:
  return (
      <div className={`flex-1 h-1 transition-colors duration-500 ease-in-out mx-2 self-center rounded-full ${active ? 'bg-blue-600' : 'bg-transparent'}`} />
  );
}

function StepBadge({
                     active,
                     completed,
                     icon: Icon,
                     label,
                     index
                   }: {
  active: boolean;
  completed: boolean;
  icon: React.ComponentType<{ className?: string; size?: number }>;
  label: string;
  index: number;
}) {
  return (
      <div className="flex flex-col items-center relative z-10 group cursor-default">
        <div
            className={`
          w-12 h-12 rounded-full flex items-center justify-center border-2 shadow-sm transition-all duration-300
          ${
                completed
                    ? 'bg-green-600 border-green-600 text-white scale-100'
                    : active
                        ? 'bg-white border-blue-600 text-blue-600 scale-110 shadow-blue-200'
                        : 'bg-white border-gray-300 text-gray-400'
            }
        `}
        >
          <Icon size={20} className={`transition-transform duration-300 ${active ? 'scale-110' : ''}`} />
        </div>
        <span
            className={`
          absolute top-14 text-xs font-semibold whitespace-nowrap transition-colors duration-300
          ${active ? 'text-blue-700' : completed ? 'text-green-700' : 'text-gray-400'}
        `}
        >
        {label}
      </span>
      </div>
  );
}

export default LeaseWizard;