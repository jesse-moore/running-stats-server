import test_activity_1 from './test_activity_1.json';
import test_activity_2 from './test_activity_2.json';
import test_activity_3 from './test_activity_3.json';
import test_activity_4 from './test_activity_4.json';
import test_activity_5 from './test_activity_5.json';
import test_stat_all from './test_stat_all.json';
import test_stat_month from './test_stat_month.json';
import test_stat_year from './test_stat_year.json';
import test_activity_without_best_efforts from './test_activity_without_best_efforts.json';
import activity_missing_latlng from './activity_missing_latlng.json';
import * as responses from './responses';
import * as weatherData from './weatherData';

const rawActivities = {
    test_activity_1,
    test_activity_2,
    test_activity_3,
    test_activity_4,
    test_activity_5,
    activity_missing_latlng,
    test_activity_without_best_efforts,
};

const testStats = {
    test_stat_all,
    test_stat_month,
    test_stat_year,
};

export { rawActivities, responses, weatherData, testStats };