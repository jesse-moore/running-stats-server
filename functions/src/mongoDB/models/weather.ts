import { Schema, model, models } from 'mongoose';
import { WeatherModel } from '../../types';

const weatherSchema = new Schema({
    windDirection: Number,
    cloudCover: Number,
    minTemp: Number,
    maxTemp: Number,
    precip: Number,
    solarRadiation: Number,
    dewPoint: Number,
    humidity: Number,
    visibility: Number,
    windSpeed: Number,
    heatIndex: Number,
    snowDepth: Number,
    maxPressure: Number,
    minPressure: Number,
    snow: Number,
    windGust: Number,
    conditions: [String],
    windChill: Number,
});

export default models.Weather || model<WeatherModel>('Weather', weatherSchema);
