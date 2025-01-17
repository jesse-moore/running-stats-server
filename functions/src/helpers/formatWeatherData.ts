import { WeatherData } from '../types';
import { toFixed, min, max } from '../utils/math';

export default (weatherData: { [k: string]: any }): WeatherData | null => {
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
                if (a.windDirection !== null && a.windDirection !== undefined) {
                    a.windDirection = toFixed(
                        Math.round(a.windDirection / values.length),
                        2
                    );
                }
                if (a.cloudCover !== null && a.cloudCover !== undefined) {
                    a.cloudCover = toFixed(
                        Math.round(a.cloudCover / values.length),
                        2
                    );
                }
                if (a.dewPoint !== null && a.dewPoint !== undefined) {
                    a.dewPoint = toFixed(
                        Math.round(a.dewPoint / values.length),
                        2
                    );
                }
            }

            if (values.length === i + 1) {
                a.conditions = Array.from(conditions);
            }

            return { ...a };
        },
        weatherObject()
    );

    if (data.minTemp === null && data.maxTemp === null) {
        return null;
    }
    return data;
};

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
