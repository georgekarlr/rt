import React from 'react';
import type { Tenant } from '../../types/tenants';
import {
    Loader2,
    User,
    Mail,
    Phone,
    CheckCircle2,
    AlertCircle
} from 'lucide-react';

type Props = {
    tenants: Tenant[];
    loading: boolean;
    selectedId: number | null;
    onSelect: (id: number) => void;
};

const SelectTenantStep: React.FC<Props> = ({ tenants, loading, selectedId, onSelect }) => {
    return (
        <div className="animate-in fade-in duration-500">
            <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900">Select Tenant</h2>
                <p className="text-sm text-gray-500 mt-1">Choose the primary tenant for this lease agreement.</p>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-12 text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                    <Loader2 className="animate-spin text-blue-600 mb-3" size={32} />
                    <p>Loading tenants...</p>
                </div>
            ) : tenants.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 bg-yellow-50 rounded-xl border border-yellow-200 text-yellow-800">
                    <AlertCircle size={32} className="mb-2" />
                    <p className="font-medium">No tenants found</p>
                    <p className="text-sm opacity-80 mt-1">Please register a tenant in the system first.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {tenants.map((t) => {
                        const isSelected = selectedId === t.id;

                        return (
                            <button
                                key={t.id}
                                type="button"
                                onClick={() => onSelect(t.id)}
                                className={`
                  relative group w-full text-left p-5 rounded-xl border transition-all duration-200 ease-in-out
                  ${
                                    isSelected
                                        ? 'bg-blue-50/50 border-blue-500 ring-1 ring-blue-500 shadow-sm z-10'
                                        : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-md cursor-pointer'
                                }
                `}
                            >
                                {/* Selection Indicator */}
                                <div className="absolute top-5 right-5">
                                    {isSelected ? (
                                        <div className="text-blue-600 animate-in zoom-in duration-200">
                                            <CheckCircle2 size={24} fill="currentColor" className="text-white bg-blue-600 rounded-full" />
                                        </div>
                                    ) : (
                                        <div className="w-5 h-5 rounded-full border-2 border-gray-300 group-hover:border-blue-400 transition-colors" />
                                    )}
                                </div>

                                <div className="flex items-start gap-4">
                                    {/* Avatar Placeholder */}
                                    <div className={`
                    p-3 rounded-full shrink-0 flex items-center justify-center
                    ${isSelected ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500 group-hover:bg-blue-50 group-hover:text-blue-600'}
                    transition-colors
                  `}>
                                        <User size={24} />
                                    </div>

                                    <div className="flex-1 min-w-0 pr-6">
                                        <h3 className={`font-semibold text-base truncate ${isSelected ? 'text-blue-900' : 'text-gray-900'}`}>
                                            {t.full_name}
                                        </h3>

                                        <div className="mt-3 space-y-2">
                                            {t.email && (
                                                <div className="flex items-center gap-2 text-sm text-gray-600 group-hover:text-gray-900 transition-colors">
                                                    <Mail size={15} className="text-gray-400 shrink-0" />
                                                    <span className="truncate">{t.email}</span>
                                                </div>
                                            )}

                                            {t.phone && (
                                                <div className="flex items-center gap-2 text-sm text-gray-600 group-hover:text-gray-900 transition-colors">
                                                    <Phone size={15} className="text-gray-400 shrink-0" />
                                                    <span className="truncate">{t.phone}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default SelectTenantStep;