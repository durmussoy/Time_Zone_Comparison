"use client";

import { useState } from "react";
import { X, Plus } from "lucide-react";
import { Zone } from "@/lib/time-utils";

interface CustomZoneModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (zone: Zone) => void;
}

export function CustomZoneModal({ isOpen, onClose, onAdd }: CustomZoneModalProps) {
    const [name, setName] = useState("");
    const [offsetHours, setOffsetHours] = useState("0");
    const [offsetMinutes, setOffsetMinutes] = useState("0");

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name) return;

        const totalMinutes = (parseInt(offsetHours) * 60) + parseInt(offsetMinutes);

        const newZone: Zone = {
            id: `custom-${Date.now()}`,
            name,
            type: 'custom',
            offset: totalMinutes
        };

        onAdd(newZone);
        onClose();
        setName("");
        setOffsetHours("0");
        setOffsetMinutes("0");
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-md bg-[#111] border border-white/10 rounded-2xl p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-white">Add Custom Time Zone</h3>
                    <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-full transition-colors">
                        <X className="w-5 h-5 text-gray-400" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Label Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Project Team, Mom's House"
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">UTC Offset</label>
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label className="text-xs text-gray-500 mb-1 block">Hours</label>
                                <input
                                    type="number"
                                    value={offsetHours}
                                    onChange={(e) => setOffsetHours(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
                                    min="-12"
                                    max="14"
                                />
                            </div>
                            <div className="flex-1">
                                <label className="text-xs text-gray-500 mb-1 block">Minutes</label>
                                <select
                                    value={offsetMinutes}
                                    onChange={(e) => setOffsetMinutes(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors appearance-none"
                                    style={{
                                        colorScheme: 'dark'
                                    }}
                                >
                                    <option value="0" style={{ backgroundColor: '#1a1a1a', color: 'white' }}>00</option>
                                    <option value="15" style={{ backgroundColor: '#1a1a1a', color: 'white' }}>15</option>
                                    <option value="30" style={{ backgroundColor: '#1a1a1a', color: 'white' }}>30</option>
                                    <option value="45" style={{ backgroundColor: '#1a1a1a', color: 'white' }}>45</option>
                                    <option value="-15" style={{ backgroundColor: '#1a1a1a', color: 'white' }}>-15</option>
                                    <option value="-30" style={{ backgroundColor: '#1a1a1a', color: 'white' }}>-30</option>
                                    <option value="-45" style={{ backgroundColor: '#1a1a1a', color: 'white' }}>-45</option>
                                </select>
                            </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                            Example: For UTC+3, enter Hours: 3, Minutes: 0. For UTC-5, enter Hours: -5.
                        </p>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition-colors flex items-center justify-center gap-2 mt-6"
                    >
                        <Plus className="w-4 h-4" />
                        Add Custom Zone
                    </button>
                </form>
            </div>
        </div>
    );
}
