import Activity from './models/activity';

export const findActivityByID = async (id: string) => {
    try {
        return await Activity.findById(id);
    } catch (error) {
        if (error.name === 'CastError') throw Error('Invalid ID');
        throw Error(error.message);
    }
};
export const findActivitiesByYear = async (year: number) => {
    try {
        // return await Activity.findById(id);
    } catch (error) {
        throw Error(error.message);
    }
};
export const findActivitiesByMonth = async (month: number) => {
    try {
        // return await Activity.findById(id);
    } catch (error) {
        throw Error(error.message);
    }
};
export const findActivitiesByYearMonth = async (
    year: number,
    month: number
) => {
    try {
        // return await Activity.findById(id);
    } catch (error) {
        throw Error(error.message);
    }
};
