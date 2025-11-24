import { format, addHours, startOfDay, addMinutes } from "date-fns";
import { toZonedTime, formatInTimeZone } from "date-fns-tz";

export interface Zone {
    id: string; // IANA string (e.g. "America/New_York") OR custom ID
    name: string; // Display name
    type: 'iana' | 'custom';
    offset?: number; // UTC offset in minutes for custom zones (e.g. 180 for UTC+3, -300 for UTC-5)
}

export function getTimeSlots(baseDate: Date = new Date()) {
    // Get UTC midnight of the current date
    const utcDate = new Date(Date.UTC(
        baseDate.getUTCFullYear(),
        baseDate.getUTCMonth(),
        baseDate.getUTCDate(),
        0, 0, 0, 0
    ));

    const slots = [];
    for (let i = 0; i < 24; i++) {
        slots.push(addHours(utcDate, i));
    }
    return slots;
}

export function formatTimeForZone(date: Date, zone: Zone, fmt: string = "HH:mm") {
    if (zone.type === 'custom' && zone.offset !== undefined) {
        // For custom zones, we manually adjust the time based on UTC
        // date is local time, we need to treat it as UTC then add offset?
        // Actually, the input 'date' from getTimeSlots is usually a local date object representing a specific moment in time.
        // We should convert it to UTC timestamp, then add the custom offset minutes.

        const utcTime = date.getTime() + (date.getTimezoneOffset() * 60000); // Convert local date to UTC timestamp
        const customTime = new Date(utcTime + (zone.offset * 60000));
        return format(customTime, fmt);
    }

    // For IANA zones
    return formatInTimeZone(date, zone.id, fmt);
}

export function getDateForZone(date: Date, zone: Zone) {
    if (zone.type === 'custom' && zone.offset !== undefined) {
        const utcTime = date.getTime() + (date.getTimezoneOffset() * 60000);
        const customTime = new Date(utcTime + (zone.offset * 60000));
        return format(customTime, "EEE, MMM d");
    }
    return formatInTimeZone(date, zone.id, "EEE, MMM d");
}

export function getTimeZoneOffsetDisplay(zone: Zone): string {
    if (zone.type === 'custom' && zone.offset !== undefined) {
        // zone.offset is in minutes
        const hours = Math.floor(Math.abs(zone.offset) / 60);
        const minutes = Math.abs(zone.offset) % 60;
        const sign = zone.offset >= 0 ? '+' : '-';

        if (minutes === 0) {
            return `GMT${sign}${hours}`;
        }
        return `GMT${sign}${hours}:${minutes.toString().padStart(2, '0')}`;
    }

    // For IANA zones, get the current offset
    const now = new Date();
    const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: zone.id,
        timeZoneName: 'longOffset'
    });

    const parts = formatter.formatToParts(now);
    const offsetPart = parts.find(part => part.type === 'timeZoneName');

    if (offsetPart && offsetPart.value) {
        // The value is like "GMT+3" or "GMT+03:00"
        return offsetPart.value;
    }

    return 'GMT+0';
}
