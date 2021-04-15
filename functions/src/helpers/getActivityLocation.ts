import { ActivityModel } from '../types';
import { fetchLocationData } from '../geoCoder';

export default async (activity: ActivityModel) => {
    try {
        const location = await fetchLocationData(activity.start_latlng);
        if (!location) return null;
        const { address } = location;
        if (!address) return null;
        const { state, country, country_code } = address;
        const city = parseCityName(address);
        return { state, country, country_code, city };
    } catch (error) {
        console.warn(
            `Failed to fetch location data for activity id: ${activity.strava_id}`
        );
        return null;
    }
};

function parseCityName(address: {
    city: string;
    city_district: string;
    hamlet: string;
    village: string;
    town: string;
    suburb: string;
    county: string;
}): string | null {
    const {
        city,
        city_district,
        hamlet,
        village,
        town,
        suburb,
        county,
    } = address;
    if (city) return city;
    if (city_district) return city_district;
    if (town) return town;
    if (village) return village;
    if (hamlet) return hamlet;
    if (suburb) return suburb;
    if (county) return county;
    return null;
}
