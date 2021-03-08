import dayjs from 'dayjs';
import { ActivityModel, WeatherData } from '../types';
import Weather from '../mongoDB/models/weather';
import fetchWeather from '../virtualCrossing';
import StatusMessage from '../utils/statusLogger';
import formatWeatherData from './formatWeatherData';

export default async (activity: ActivityModel): Promise<WeatherData | null> => {
    const parsedActivity = parseActivity(activity);
    const weatherData = await fetchWeather(parsedActivity);
    if (weatherData === null) {
        console.warn(
            `Failed to fetch weather for activity id: ${activity.strava_id}`
        );
        return null;
    }
    const formattedWeather = formatWeatherData(weatherData);
    if (formattedWeather === null) {
        console.warn(
            `Failed to format weather data for activity id: ${activity.strava_id}`
        );
        return null;
    }
    const weather = new Weather(formattedWeather);
    const weatherValidationError = weather.validateSync();
    if (weatherValidationError !== undefined) {
        StatusMessage.addValidationError(weather.id, weatherValidationError);
        return null;
    }
    return weather.toObject();
};

function parseActivity(
    activity: ActivityModel
): {
    id: string;
    lat: number;
    lng: number;
    startDate: string;
    startTime: string;
    endDate: string;
    endTime: string;
} {
    const startDate = dayjs(activity.start_date_local)
        .utc()
        .format('YYYY-MM-DDT00:00:00');
    const endDate = dayjs(activity.start_date_local)
        .utc()
        .add(activity.elapsed_time, 'second')
        .format('YYYY-MM-DDT00:00:00');
    const startTime = dayjs(activity.start_date_local).utc().format('HH:mm:ss');
    const endTime = dayjs(activity.start_date_local)
        .utc()
        .add(activity.elapsed_time, 'second')
        .format('HH:mm:ss');

    return {
        id: activity._id,
        lat: activity.start_latlng.lat,
        lng: activity.start_latlng.lng,
        startDate,
        endDate,
        startTime,
        endTime,
    };
}
