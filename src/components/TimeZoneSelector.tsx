"use client";

import { useState, useMemo } from "react";
import { ALL_TIMEZONES } from "@/lib/constants";
import { Plus, X, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Zone } from "@/lib/time-utils";
import { CustomZoneModal } from "./CustomZoneModal";

interface TimeZoneSelectorProps {
    selectedZones: Zone[];
    onAddZone: (zone: Zone) => void;
    onRemoveZone: (zoneId: string) => void;
    isSingleSelect?: boolean;
}

export function TimeZoneSelector({ selectedZones, onAddZone, onRemoveZone, isSingleSelect = false }: TimeZoneSelectorProps) {
    const [isOpen, setIsOpen] = useState(isSingleSelect); // Auto-open if single select mode
    const [searchQuery, setSearchQuery] = useState("");
    const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);

    const availableZones = useMemo(() => {
        return ALL_TIMEZONES.filter(
            (tz) => !selectedZones.some((selected) => selected.id === tz.value)
        ).filter((tz) =>
            tz.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
            tz.value.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [selectedZones, searchQuery]);

    const isLimitReached = !isSingleSelect && selectedZones.length >= 5;

    return (
        <div className="relative z-10 w-full">
            {!isSingleSelect && (
                <div className="flex flex-wrap gap-2 mb-4">
                    {selectedZones.map((zone) => (
                        <div
                            key={zone.id}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-white/10 border border-gray-200 dark:border-white/20 backdrop-blur-md text-sm font-medium text-gray-900 dark:text-white animate-in fade-in zoom-in duration-200"
                        >
                            <span>{zone.name}</span>
                            <button
                                onClick={() => onRemoveZone(zone.id)}
                                className="hover:bg-gray-200 dark:hover:bg-white/20 rounded-full p-0.5 transition-colors"
                            >
                                <X className="w-3 h-3 text-gray-500 dark:text-gray-400" />
                            </button>
                        </div>
                    ))}

                    <button
                        onClick={() => !isLimitReached && setIsOpen(!isOpen)}
                        disabled={isLimitReached}
                        className={cn(
                            "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors",
                            isLimitReached
                                ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                                : "bg-blue-600 hover:bg-blue-700 text-white"
                        )}
                    >
                        <Plus className="w-4 h-4" />
                        <span>{isLimitReached ? "Limit Reached (5)" : "Add Location"}</span>
                    </button>
                </div>
            )}

            {isOpen && (
                <>
                    {!isSingleSelect && (
                        <div
                            className="fixed inset-0 z-0"
                            onClick={() => setIsOpen(false)}
                        />
                    )}
                    <div className={cn(
                        "rounded-xl border border-gray-200 dark:border-white/20 bg-white dark:bg-black/90 backdrop-blur-xl shadow-2xl z-20 flex flex-col",
                        isSingleSelect ? "w-full relative" : "absolute top-full left-0 mt-2 w-80 max-h-96"
                    )}>
                        <div className="p-3 border-b border-gray-100 dark:border-white/10">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search city or country..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 transition-colors placeholder:text-gray-500"
                                    autoFocus
                                />
                            </div>
                        </div>

                        <div className={cn("overflow-y-auto flex-1 p-2", isSingleSelect ? "max-h-60" : "")}>
                            <button
                                onClick={() => {
                                    setIsOpen(false);
                                    setIsCustomModalOpen(true);
                                }}
                                className="w-full text-left px-3 py-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-600/20 text-blue-600 dark:text-blue-400 text-sm transition-colors flex items-center gap-2 mb-2 border border-blue-200 dark:border-blue-500/30 border-dashed"
                            >
                                <Plus className="w-4 h-4" />
                                <span>Add Custom Time Zone</span>
                            </button>

                            {availableZones.length === 0 ? (
                                <div className="p-4 text-center text-gray-500 dark:text-gray-400 text-sm">
                                    No locations found
                                </div>
                            ) : (
                                availableZones.map((tz) => (
                                    <button
                                        key={tz.value}
                                        onClick={() => {
                                            onAddZone({
                                                id: tz.value,
                                                name: tz.label,
                                                type: 'iana'
                                            });
                                            if (!isSingleSelect) {
                                                setIsOpen(false);
                                                setSearchQuery("");
                                            }
                                        }}
                                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 text-sm transition-colors flex items-center justify-between group"
                                    >
                                        <span className="text-gray-900 dark:text-gray-200">{tz.label}</span>
                                        <span className="text-xs text-gray-500 font-mono">{tz.offset}</span>
                                    </button>
                                ))
                            )}
                        </div>
                    </div>
                </>
            )}

            <CustomZoneModal
                isOpen={isCustomModalOpen}
                onClose={() => setIsCustomModalOpen(false)}
                onAdd={onAddZone}
            />
        </div>
    );
}
