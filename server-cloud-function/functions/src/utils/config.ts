import * as functions from 'firebase-functions';

const config = (function () {
    if (Object.getOwnPropertyNames(functions.config()).length === 0) {
        return {
            playground: {
                url:
                    'http://localhost:5001/strava-stats-aac46/us-central1/strava/api',
            },
        };
    } else {
        return functions.config();
    }
})();

export default config;
