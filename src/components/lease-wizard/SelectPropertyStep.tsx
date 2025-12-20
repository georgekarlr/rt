import React from 'react';
import type { Property } from '../../types/properties';
import {
    Loader2,
    MapPin,
    Building2,
    CheckCircle2,
    Lock,
    DollarSign,
    AlertCircle
} from 'lucide-react';

type Props = {
    properties: Property[];
    loading: boolean;
    selectedId: number | null;
    onSelect: (id: number) => void;
};

const SelectPropertyStep: React.FC<Props> = ({ properties, loading, selectedId, onSelect }) => {
    return (
        <div className="animate-in fade-in duration-500">
            <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900">Select Property</h2>
                <p className="text-sm text-gray-500 mt-1">Choose an available property to start the lease agreement.</p>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-12 text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                    <Loader2 className="animate-spin text-blue-600 mb-3" size={32} />
                    <p>Loading properties...</p>
                </div>
            ) : properties.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 bg-yellow-50 rounded-xl border border-yellow-200 text-yellow-800">
                    <AlertCircle size={32} className="mb-2" />
                    <p className="font-medium">No properties found</p>
                    <p className="text-sm opacity-80 mt-1">Please add a property to the system first.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {properties.map((p) => {
                        const isOccupied = p.status === 'occupied';
                        const isSelected = selectedId === p.id;

                        return (
                            <button
                                key={p.id}
                                type="button"
                                disabled={isOccupied}
                                onClick={() => {
                                    if (!isOccupied) onSelect(p.id);
                                }}
                                className={`
                  relative group w-full text-left p-5 rounded-xl border transition-all duration-200 ease-in-out
                  ${
                                    isOccupied
                                        ? 'bg-gray-50 border-gray-200 opacity-60 cursor-not-allowed'
                                        : isSelected
                                            ? 'bg-blue-50/50 border-blue-500 ring-1 ring-blue-500 shadow-sm z-10'
                                            : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-md cursor-pointer'
                                }
                `}
                            >
                                {/* Selection/Status Indicator Icons */}
                                <div className="absolute top-5 right-5">
                                    {isOccupied ? (
                                        <div className="text-gray-400" title="Property Occupied">
                                            <Lock size={20} />
                                        </div>
                                    ) : isSelected ? (
                                        <div className="text-blue-600 animate-in zoom-in duration-200">
                                            <CheckCircle2 size={24} fill="currentColor" className="text-white bg-blue-600 rounded-full" />
                                        </div>
                                    ) : (
                                        <div className="w-5 h-5 rounded-full border-2 border-gray-300 group-hover:border-blue-400 transition-colors" />
                                    )}
                                </div>

                                {/* Header: Icon & Name */}
                                <div className="flex items-start gap-3 pr-8">
                                    <div className={`
                    p-2.5 rounded-lg shrink-0
                    ${isOccupied ? 'bg-gray-200 text-gray-500' : isSelected ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600 group-hover:bg-blue-50 group-hover:text-blue-600'}
                    transition-colors
                  `}>
                                        <Building2 size={20} />
                                    </div>

                                    <div>
                                        <h3 className={`font-semibold text-base ${isOccupied ? 'text-gray-500' : 'text-gray-900'}`}>
                                            {p.name}
                                        </h3>

                                        {/* Status Badge */}
                                        <span
                                            className={`
                        inline-flex items-center gap-1.5 mt-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium uppercase tracking-wide
                        ${
                                                p.status === 'vacant'
                                                    ? 'bg-green-100 text-green-700 border border-green-200'
                                                    : 'bg-gray-200 text-gray-600 border border-gray-300'
                                            }
                      `}
                                        >
                      <span className={`w-1.5 h-1.5 rounded-full ${p.status === 'vacant' ? 'bg-green-500' : 'bg-gray-500'}`} />
                                            {String(p.status)}
                    </span>
                                    </div>
                                </div>

                                <div className="mt-4 space-y-2">
                                    {/* Address */}
                                    <div className="flex items-start gap-2 text-sm text-gray-600">
                                        <MapPin size={16} className="mt-0.5 shrink-0 text-gray-400" />
                                        <span className="line-clamp-2">
                      {p.address}
                                            {(p.city || p.state || p.zip_code) && (
                                                <span className="block text-gray-500 text-xs mt-0.5">
                          {[p.city, p.state, p.zip_code].filter(Boolean).join(', ')}
                        </span>
                                            )}
                    </span>
                                    </div>

                                    {/* Rent */}
                                    <div className="flex items-center gap-2 text-sm">
                                        <DollarSign size={16} className="shrink-0 text-gray-400" />
                                        <span className={`font-medium ${isOccupied ? 'text-gray-500' : 'text-gray-900'}`}>
                      ${Number(p.market_rent).toLocaleString()}
                                            <span className="text-gray-500 font-normal"> / month (market)</span>
                    </span>
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

export default SelectPropertyStep;