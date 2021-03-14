import axios from 'axios';
import { handleAxiosError } from '../utils/errorHandler';

export default async (
    accessToken: string,
    id: number
): Promise<{ [k: string]: any } | null> => {
    const baseURL = 'https://www.strava.com/api/v3/';
    const url = `${baseURL}activities/${id}`;
    try {
        const response = await axios({
            method: 'get',
            url,
            headers: {
                Authorization: `Bearer ${accessToken}`,
                Accept: 'application/json',
                scope: 'read_all',
                'cache-control': 'no-cache',
            },
        });
        return response.data;
    } catch (error) {
        if (
            error.response &&
            error.response.data &&
            error.response.data.message === 'Resource Not Found'
        ) {
            console.warn(`Strava Fetch Error: activity id: ${id} not found`);
            return null;
        }
        console.error(
            'Strava Fetch Error: Failed to fetch activity id: ${id} from strava'
        );
        handleAxiosError(error);
        throw new Error();
    }
};
