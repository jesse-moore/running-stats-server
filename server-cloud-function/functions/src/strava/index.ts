import axios from 'axios';
import { getStravaAccessToken, saveNewToken } from '../firebase';
import { STRAVA_CLIENT_ID, STRAVA_CLIENT_SECRET } from '../keys.json';
import { handleAxiosError } from '../utils/errorHandler';

const fetchActivity = async (accessToken: string, id: number): Promise<{ [k: string]: any } | null> => {
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
        handleAxiosError(error);
        return null;
    }
};

const getAccessToken = async () => {
    const {
        accessToken,
        expiresAt,
        refreshToken,
    } = await getStravaAccessToken();
    const currentDateUnix = new Date().valueOf();
    const expiredDateUnix = expiresAt * 1000;
    if (expiredDateUnix < currentDateUnix + 3000000) {
        const newAccessToken = await getNewToken(refreshToken);
        return newAccessToken;
    } else {
        return accessToken;
    }
};

const getNewToken = async (refreshToken: string) => {
    try {
        const url = `https://www.strava.com/oauth/token?client_id=${STRAVA_CLIENT_ID}&client_secret=${STRAVA_CLIENT_SECRET}&grant_type=refresh_token&refresh_token=${refreshToken}`;
        const response = await axios({
            method: 'post',
            url,
            headers: {
                Accept: '*/*',
            },
        });
        const data = response.data;
        const newTokenData = {
            accessToken: data.access_token,
            expiresAt: data.expires_at,
            refreshToken: data.refresh_token,
        };
        await saveNewToken(newTokenData);
        return data.access_token;
    } catch (error) {
        throw new Error(error);
    }
};

export { getAccessToken, fetchActivity };
