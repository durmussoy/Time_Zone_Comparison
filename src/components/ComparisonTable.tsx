"use client";

import { useEffect, useState } from "react";
import { getTimeSlots, formatTimeForZone, getDateForZone, getTimeZoneOffsetDisplay, Zone } from "@/lib/time-utils";
import { format } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import { cn } from "@/lib/utils";

interface ComparisonTableProps {
    baseZone: Zone;
    targetZones: Zone[];
}

export function ComparisonTable({ baseZone, targetZones }: ComparisonTableProps) {
    const [slots, setSlots] = useState<Date[]>([]);

    useEffect(() => {
        setSlots(getTimeSlots());
    }, []);

    const allZones = [baseZone, ...targetZones];

    return (
        <div
            className="w-full overflow-x-auto rounded-2xl border backdrop-blur-sm shadow-sm transition-colors duration-300"
            style={{
                backgroundColor: 'var(--component-bg)',
                borderColor: 'var(--component-border)'
            }}
        >
            <table className="w-full border-collapse">
                <thead>
                    <tr>
                        <th
                            className="p-4 text-left text-xs font-semibold uppercase tracking-wider border-b sticky left-0 z-10 backdrop-blur-md transition-colors duration-300"
                            style={{
                                borderColor: 'var(--component-border)',
                                backgroundColor: 'var(--component-hover)',
                                color: 'var(--component-text)'
                            }}
                        >
                            Time (UTC)
                        </th>
                        {allZones.map((zone) => (
                            <th
                                key={zone.id}
                                className="p-4 text-left text-xs font-semibold uppercase tracking-wider border-b min-w-[150px] transition-colors duration-300"
                                style={{
                                    borderColor: 'var(--component-border)',
                                    color: 'var(--component-text)'
                                }}
                            >
                                {zone.name}
                                <div
                                    className="text-[10px] font-normal mt-1 opacity-70 uppercase"
                                    style={{ color: 'var(--component-text)' }}
                                >
                                    {getDateForZone(new Date(), zone)}
                                </div>
                                <div
                                    className="text-[10px] font-semibold mt-0.5 opacity-80"
                                    style={{ color: 'var(--component-text)' }}
                                >
                                    {getTimeZoneOffsetDisplay(zone)}
                                </div>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {slots.map((slot, i) => {
                        // Check if this slot is the current hour
                        const now = new Date();
                        const isCurrentHour = slot.getHours() === now.getHours();

                        return (
                            <tr
                                key={i}
                                className={cn(
                                    "group transition-colors border-b last:border-0",
                                    isCurrentHour
                                        ? "bg-blue-50/80 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800/30"
                                        : "hover:bg-gray-50 dark:hover:bg-white/5"
                                )}
                                style={{
                                    borderColor: isCurrentHour ? '' : 'var(--component-border)'
                                }}
                            >
                                <td
                                    className={cn(
                                        "p-3 text-sm font-mono sticky left-0 backdrop-blur-sm transition-colors border-r",
                                        isCurrentHour
                                            ? "bg-blue-50/90 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-bold border-blue-200 dark:border-blue-800/30"
                                            : "group-hover:bg-gray-50 dark:group-hover:bg-black/40"
                                    )}
                                    style={{
                                        borderColor: isCurrentHour ? '' : 'var(--component-border)',
                                        backgroundColor: isCurrentHour ? '' : 'var(--component-bg)',
                                        color: isCurrentHour ? '' : 'var(--component-text)'
                                    }}
                                >
                                    {formatInTimeZone(slot, "UTC", "HH:mm")}
                                    {isCurrentHour && (
                                        <span className="ml-2 inline-block w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                                    )}
                                </td>
                                {allZones.map((zone) => {
                                    const timeStr = formatTimeForZone(slot, zone, "HH:mm");
                                    const hour = parseInt(timeStr.split(":")[0], 10);
                                    const isBusinessHour = hour >= 8 && hour < 18; // 8 AM - 6 PM
                                    const isSleepingHour = hour >= 23 || hour < 7; // 11 PM - 7 AM

                                    return (
                                        <td key={zone.id} className="p-3">
                                            <div
                                                className={cn(
                                                    "inline-flex items-center justify-center px-3 py-1 rounded-md text-sm font-medium transition-all",
                                                    isBusinessHour
                                                        ? "bg-green-100 text-green-700 border-green-200 dark:bg-green-500/20 dark:text-green-400 dark:border-green-500/30 dark:shadow-[0_0_10px_rgba(74,222,128,0.1)]"
                                                        : isSleepingHour
                                                            ? "text-gray-400 dark:text-gray-600"
                                                            : "text-gray-700 dark:text-gray-300"
                                                )}
                                            >
                                                {timeStr}
                                            </div>
                                        </td>
                                    );
                                })}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
