"use client";

import { useState, useEffect } from "react";
import { TimeZoneSelector } from "@/components/TimeZoneSelector";
import { ComparisonTable } from "@/components/ComparisonTable";
import { Clock, Globe, MapPin, ArrowRightLeft, Sun, Moon } from "lucide-react";
import { Zone } from "@/lib/time-utils";
import { ALL_TIMEZONES } from "@/lib/constants";
import { cn } from "@/lib/utils";

export default function Home() {
    // Default to Istanbul as base, and New York as target
    const [baseZone, setBaseZone] = useState<Zone>({
        id: "Europe/Istanbul",
        name: "Istanbul, Turkey",
        type: "iana"
    });

    const [targetZones, setTargetZones] = useState<Zone[]>([
        { id: "America/New_York", name: "New York, USA", type: "iana" }
    ]);

    const [isChangingBase, setIsChangingBase] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);

    // Initialize theme based on system preference or default to dark
    useEffect(() => {
        // Check if user has a preference stored or system preference
        // For simplicity in this demo, we'll default to light and allow toggle
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light');
    }, []);

    // Auto-detect user's timezone on first load
    useEffect(() => {
        try {
            const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            const matchedZone = ALL_TIMEZONES.find(tz => tz.value === userTimezone);

            if (matchedZone) {
                setBaseZone({
                    id: matchedZone.value,
                    name: matchedZone.label,
                    type: 'iana'
                });
            }
        } catch (error) {
            // If timezone detection fails, keep default (Istanbul)
            console.error('Failed to detect timezone:', error);
        }
    }, []);

    const toggleTheme = () => {
        const newMode = !isDarkMode;
        setIsDarkMode(newMode);
        if (newMode) {
            document.documentElement.classList.add('dark');
            document.documentElement.classList.remove('light');
        } else {
            document.documentElement.classList.remove('dark');
            document.documentElement.classList.add('light');
        }
    };

    const handleAddZone = (zone: Zone) => {
        if (targetZones.length >= 5) return;

        // Prevent duplicates
        if (!targetZones.some(z => z.id === zone.id) && zone.id !== baseZone.id) {
            setTargetZones([...targetZones, zone]);
        }
    };

    const handleRemoveZone = (zoneId: string) => {
        setTargetZones(targetZones.filter((z) => z.id !== zoneId));
    };

    const handleChangeBaseZone = (zone: Zone) => {
        // If the new base zone was in the target list, remove it from there
        const newTargets = targetZones.filter(z => z.id !== zone.id);

        setBaseZone(zone);
        setTargetZones(newTargets);
        setIsChangingBase(false);
    };

    return (
        <main className={cn(
            "min-h-screen transition-colors duration-300 selection:bg-blue-500/30",
            isDarkMode ? "bg-black text-white" : "bg-gray-50 text-gray-900"
        )}>
            {/* Background Gradients */}
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                <div className={cn(
                    "absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full blur-[120px] transition-colors duration-500",
                    isDarkMode ? "bg-blue-600/20" : "bg-blue-400/20"
                )} />
                <div className={cn(
                    "absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full blur-[120px] transition-colors duration-500",
                    isDarkMode ? "bg-purple-600/20" : "bg-purple-400/20"
                )} />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <header className="mb-12 text-center relative">
                    {/* Theme Toggle Button */}
                    <button
                        onClick={toggleTheme}
                        className={cn(
                            "absolute right-0 top-0 p-2 rounded-full transition-all duration-300",
                            isDarkMode ? "bg-white/10 hover:bg-white/20 text-yellow-400" : "bg-black/5 hover:bg-black/10 text-gray-700"
                        )}
                        title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                    >
                        {isDarkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
                    </button>

                    <div className={cn(
                        "inline-flex items-center justify-center p-3 mb-6 rounded-2xl border backdrop-blur-xl shadow-2xl transition-colors duration-300",
                        isDarkMode ? "bg-white/5 border-white/10" : "bg-white border-gray-200 shadow-gray-200/50"
                    )}>
                        <Globe className="w-8 h-8 text-blue-500 mr-3" />
                        <h1 className={cn(
                            "text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r",
                            isDarkMode ? "from-white to-gray-400" : "from-gray-900 to-gray-600"
                        )}>
                            World's Time Zone Comparison
                        </h1>
                    </div>
                    <p className={cn(
                        "max-w-2xl mx-auto text-lg transition-colors",
                        isDarkMode ? "text-gray-400" : "text-gray-600"
                    )}>
                        Compare time zones effortlessly. Find the perfect meeting time across the globe with our premium comparison tool.
                    </p>
                </header>

                <div className="space-y-8">
                    {/* Base Zone Selection Area */}
                    <div className={cn(
                        "border rounded-2xl p-6 backdrop-blur-md transition-colors duration-300",
                        isDarkMode ? "bg-white/5 border-white/10" : "bg-white border-gray-200 shadow-lg"
                    )}>
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                            <div>
                                <h2 className={cn("text-lg font-semibold mb-1 flex items-center gap-2", isDarkMode ? "text-white" : "text-gray-900")}>
                                    <MapPin className="w-5 h-5 text-green-500" />
                                    Your Base Location
                                </h2>
                                <p className={cn("text-sm", isDarkMode ? "text-gray-400" : "text-gray-500")}>
                                    This is the reference time for comparisons.
                                </p>
                            </div>

                            <div className="flex items-center gap-4">
                                {!isChangingBase ? (
                                    <div className={cn(
                                        "flex items-center gap-3 px-4 py-2 rounded-xl border transition-colors",
                                        isDarkMode ? "bg-black/40 border-white/10" : "bg-gray-100 border-gray-200"
                                    )}>
                                        <span className={cn("font-medium text-lg", isDarkMode ? "text-white" : "text-gray-900")}>{baseZone.name}</span>
                                        <button
                                            onClick={() => setIsChangingBase(true)}
                                            className="p-2 hover:bg-white/10 rounded-lg text-blue-500 transition-colors"
                                            title="Change Base Location"
                                        >
                                            <ArrowRightLeft className="w-4 h-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="w-full md:w-80">
                                        <TimeZoneSelector
                                            selectedZones={[]}
                                            onAddZone={handleChangeBaseZone}
                                            onRemoveZone={() => { }}
                                            isSingleSelect={true}
                                        />
                                        <button
                                            onClick={() => setIsChangingBase(false)}
                                            className={cn("text-xs mt-2 underline", isDarkMode ? "text-gray-500 hover:text-white" : "text-gray-500 hover:text-black")}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div>
                            <h2 className={cn("text-xl font-semibold mb-2 flex items-center gap-2", isDarkMode ? "text-white" : "text-gray-900")}>
                                <Clock className="w-5 h-5 text-blue-500" />
                                Target Locations
                            </h2>
                            <p className={cn("text-sm", isDarkMode ? "text-gray-500" : "text-gray-600")}>
                                Add cities to compare their working hours with your local time. (Max 5)
                            </p>
                        </div>
                        <TimeZoneSelector
                            selectedZones={targetZones}
                            onAddZone={handleAddZone}
                            onRemoveZone={handleRemoveZone}
                        />
                    </div>

                    <ComparisonTable baseZone={baseZone} targetZones={targetZones} />

                    <div className={cn("mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm", isDarkMode ? "text-gray-500" : "text-gray-600")}>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
                            <span>Business Hours (8 AM - 6 PM)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className={cn("w-3 h-3 rounded-full border", isDarkMode ? "bg-transparent border-white/20" : "bg-white border-gray-300")} />
                            <span>Personal Time</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className={cn("w-3 h-3 rounded-full", isDarkMode ? "bg-gray-600" : "bg-gray-400")} />
                            <span>Sleeping Hours (11 PM - 7 AM)</span>
                        </div>
                    </div>
                </div>
            </div>

            <footer className={cn(
                "relative z-10 mt-20 py-8 border-t text-center text-sm transition-colors",
                isDarkMode ? "border-white/5 text-gray-600" : "border-gray-200 text-gray-500"
            )}>
                <p>© 2025 World's Time Zone Comparison. Built by Durmus Soy with Vibe Coding.</p>
            </footer>
        </main>
    );
}
