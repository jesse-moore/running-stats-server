import * as functions from 'firebase-functions';
import config from './config.env';

export default (function () {
    if (Object.getOwnPropertyNames(functions.config()).length === 0) {
        return config;
    } else {
        return functions.config();
    }
})();
