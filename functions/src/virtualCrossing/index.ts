import axios from 'axios';
import { handleAxiosError } from '../utils/errorHandler';
import { VC_KEY } from '../keys.json';

export default async function fetchWeather({
    lat,
    lng,
    startDate,
    startTime,
    endDate,
    endTime,
}: {
    lat: number;
    lng: number;
    startDate: string;
    startTime: string;
    endDate: string;
    endTime: string;
}): Promise<{ [k: string]: any } | null> {
    const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/weatherdata/history?&aggregateHours=1&dayStartTime=${startTime}&dayEndTime=${endTime}&startDateTime=${startDate}&endDateTime=${endDate}&unitGroup=metric&contentType=json&locations=${lat},${lng}&&locationMode=single&includeAstronomy=true&key=${VC_KEY}`;
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        handleAxiosError(error);
        return null;
    }
}
