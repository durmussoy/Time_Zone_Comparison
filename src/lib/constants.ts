import * as ct from "countries-and-timezones";

export interface TimeZoneOption {
    value: string;
    label: string;
    offset?: string; // GMT+3 etc. for display
}

function getAllTimeZones(): TimeZoneOption[] {
    // Get all time zones supported by the browser
    const rawTimeZones = Intl.supportedValuesOf('timeZone');

    const formattedTimeZones = rawTimeZones.map(zone => {
        // Get country info
        const tzData = ct.getTimezone(zone);
        // The library might return 'countries' (array) or 'country' (string) depending on version/data
        // We cast to any to avoid TS errors if types are slightly off, but runtime check is what matters
        const data = tzData as any;
        const countryCode = data?.countries?.[0] || data?.country;
        const countryName = countryCode ? ct.getCountry(countryCode)?.name : null;

        // Format label: "City, Country" or just "City" if country not found
        const parts = zone.split('/');
        const city = parts[parts.length - 1].replace(/_/g, ' ');

        // Some zones are just "UTC" or "CET" which don't have city parts like that
        let label = city;
        if (countryName) {
            label = `${city}, ${countryName}`;
        } else if (parts.length > 1) {
            // Fallback for things like "America/New_York" where lookup might fail (though it shouldn't)
            // or generic zones
            const region = parts[0];
            label = `${city} (${region})`;
        }

        // Get current offset
        const now = new Date();
        const offset = new Intl.DateTimeFormat('en-US', {
            timeZone: zone,
            timeZoneName: 'longOffset'
        }).formatToParts(now).find(part => part.type === 'timeZoneName')?.value || '';

        // Extract just the GMT part (e.g., "GMT+3")
        const gmtOffset = offset.replace('GMT', '');

        return {
            value: zone,
            label: label,
            offset: gmtOffset || '+00:00'
        };
    }).sort((a, b) => a.label.localeCompare(b.label));

    // Debug logging
    console.log("Istanbul Entry:", formattedTimeZones.find(t => t.value === "Europe/Istanbul"));

    return formattedTimeZones;
}

export const ALL_TIMEZONES: TimeZoneOption[] = getAllTimeZones();

export const POPULAR_TIMEZONES = ALL_TIMEZONES;
