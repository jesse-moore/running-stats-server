import { expect } from 'chai';
import {
    weather_data,
    weather_data_multiple_values,
    weather_data_null_values,
} from '../../data/responses';
import formatWeatherData from '../../../src/helpers/formatWeatherData';
import {
    formattedWeather,
    formatterWeatherMultipleValues,
} from '../../data/weatherData';

describe('formatWeatherData', function () {
    it('should return null when no location property', function () {
        const result = formatWeatherData({});
        expect(result).null;
    });
    it('should return null when if values property is not an Array', function () {
        const result = formatWeatherData({ location: { values: {} } });
        expect(result).null;
    });
    it('should format weather correctly', function () {
        const result = formatWeatherData(weather_data);
        expect(result).deep.equal(formattedWeather);
    });
    it('should format weather correctly when there is mulitple values in array', function () {
        const result = formatWeatherData(weather_data_multiple_values);
        expect(result).deep.equal(formatterWeatherMultipleValues);
    });
    it('should null if no max or min temp', function () {
        const result = formatWeatherData(weather_data_null_values);
        expect(result).null;
    });
});
