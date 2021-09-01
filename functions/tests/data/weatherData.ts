export const formattedWeather = {
    windDirection: 338,
    cloudCover: 0,
    minTemp: 15,
    maxTemp: 15,
    precip: 0,
    solarRadiation: 549,
    dewPoint: -2.6,
    humidity: 29.56,
    visibility: 16,
    windSpeed: 19.2,
    heatIndex: null,
    snowDepth: 0,
    maxPressure: 1024.3,
    minPressure: 1024.3,
    snow: 0,
    windGust: 31.7,
    conditions: ['Clear'],
    windChill: null,
    sunrise: '2021-03-28T07:08:00-05:00',
    sunset: '2021-03-28T19:35:33-05:00',
    moonPhase: 0.5,
};

export const formatterWeatherMultipleValues = {
    ...formattedWeather,
    windDirection: 281,
    cloudCover: 28,
    dewPoint: -3,
};

export const formatterWeatherNullValues = {
    ...formattedWeather,
    maxTemp: null,
    minTemp: null,
};
