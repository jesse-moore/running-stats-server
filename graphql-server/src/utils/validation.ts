import { schema } from './validationSchema';
import {
    ActivityObject,
    InvaildActivityObject,
    RawActivityObject,
} from '../types';

export const parseActivities = (
    activities: RawActivityObject[]
): {
    validEntries: ActivityObject[];
    invalidEntries: InvaildActivityObject[];
} => {
    if (!Array.isArray(activities)) {
        throw new Error('Error parsing activities: Activities is not an Array');
    }
    const validEntries: ActivityObject[] = [];
    const invalidEntries: InvaildActivityObject[] = [];
    activities.forEach((activity) => {
        const validatedActivity = parseActivity(activity);
        if ('error' in validatedActivity) {
            invalidEntries.push(validatedActivity);
        } else {
            validEntries.push(validatedActivity);
        }
    });
    return { validEntries, invalidEntries };
};

const parseActivity = (
    activity: RawActivityObject
): ActivityObject | InvaildActivityObject => {
    const { value, error } = schema.validate(activity);
    if (error) {
        return {
            error: {
                message: error.message,
                strava_id: value.strava_id,
            },
        };
    }
    return value;
};
