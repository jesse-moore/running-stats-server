import axios from 'axios';
import dayjs from 'dayjs';
import { handleAxiosError } from '../utils/errorHandler';
import { ActivityModel, WeatherData } from '../types';
import { VC_KEY } from '../keys.json';

export default async function getWeather(
    activity: ActivityModel
): Promise<WeatherData | null> {
    const parsedActivity = parseActivity(activity);
    const weatherData = await fetchWeather(parsedActivity);
    if (weatherData === null) return null;
    const parsedWeather = parseWeather(weatherData, parsedActivity.id);
    if (parsedWeather === null) return null;
    return parsedWeather;
}

async function fetchWeather({
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
        const response = await axios({
            method: 'get',
            url,
        });
        return response.data;
    } catch (error) {
        handleAxiosError(error);
        return null;
    }
}

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

function parseWeather(
    weatherData: { [k: string]: any },
    id: any
): WeatherData | null {
    if (!weatherData.location || !weatherData.location.values) return null;
    const { values } = weatherData.location;
    if (!Array.isArray(values)) return null;

    const conditions: Set<string> = new Set();
    const data = values.reduce(
        (a: WeatherData, c: { [k: string]: any }, i: number) => {
            a.windDirection += c.wdir;
            a.sunrise = c.sunrise;
            a.sunset = c.sunset;
            a.cloudCover += c.cloudcover;
            a.minTemp = min(a.minTemp, c.mint);
            a.maxTemp = max(a.maxTemp, c.maxt);
            a.precip = max(a.precip, c.precip);
            a.dewPoint += c.dew;
            a.humidity = max(a.humidity, c.humidity);
            a.visibility = max(a.visibility, c.visibility);
            a.windSpeed = max(a.windSpeed, c.wspd);
            a.heatIndex = max(a.heatIndex, c.heatindex);
            a.moonPhase = c.moonphase;
            a.snowDepth = max(a.snowDepth, c.snowdepth);
            a.maxPressure = max(a.maxPressure, c.sealevelpressure);
            a.minPressure = min(a.minPressure, c.sealevelpressure);
            a.snow = max(a.snow, c.snow);
            a.solarRadiation = max(a.solarRadiation, c.solarradiation);
            a.windGust = max(a.windGust, c.wgust);
            a.windChill = min(a.windChill, c.windchill);
            c.conditions.split(', ').forEach((e: string) => {
                conditions.add(e);
            });

            if (values.length > 1 && i + 1 === values.length) {
                a.windDirection = Math.round(a.windDirection / values.length);
                a.cloudCover = Math.round(a.cloudCover / values.length);
                a.dewPoint = Math.round(a.dewPoint / values.length);
            }

            if (values.length === i + 1) {
                a.conditions = Array.from(conditions);
            }

            return { activityId: id, ...a };
        },
        weatherObject()
    );

    return data;
}

function weatherObject() {
    return {
        windDirection: 0,
        cloudCover: 0,
        minTemp: null,
        maxTemp: null,
        precip: null,
        solarRadiation: null,
        dewPoint: 0,
        humidity: null,
        visibility: null,
        windSpeed: null,
        heatIndex: null,
        snowDepth: null,
        maxPressure: null,
        minPressure: null,
        snow: null,
        windGust: null,
        conditions: [],
        windChill: null,
    };
}

function max(a: number, b: number) {
    if (a === null) return b;
    return a < b ? b : a;
}

function min(a: number, b: number) {
    if (a === null) return b;
    return a > b ? b : a;
}
