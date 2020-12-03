import axios from 'axios';
const firebase = require('../firebase');
const stravaKeys = require('./strava.key.json');
import { baseURL } from './constants';

import { RawActivityObject } from '../types';

export const fetchActivitiesFromStrava = async (): Promise<
    RawActivityObject[]
> => {
    const accessToken = await getAccessToken();
    const activitiesArray = [];
    let page = 1;
    do {
        const activities = await fetchActivities(accessToken, 20, page);
        if (activities.length === 0) break;
        activitiesArray.push(...activities);
        page++;
        await new Promise((resolve) => setTimeout(resolve, 2000));
    } while (page < 2);
    return activitiesArray;
};

const fetchActivities = async (
    accessToken: string,
    perPage: number = 1,
    page: number = 1
): Promise<RawActivityObject[]> => {
    const url = `${baseURL}athlete/activities?per_page=${perPage}&page=${page}`;
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
        const message = error.response.data.message;
        throw new Error(message);
    }
};

const getAccessToken = async (): Promise<string> => {
    const {
        accessToken,
        expiresAt,
        refreshToken,
    } = await firebase.getStravaAccessToken();
    const currentDateUnix = new Date().valueOf();
    const expiredDateUnix = expiresAt * 1000;
    if (expiredDateUnix < currentDateUnix + 3000000) {
        const newAccessToken = await getNewToken(refreshToken);
        return newAccessToken;
    } else {
        return accessToken;
    }
};

const getNewToken = async (refreshToken: string): Promise<string> => {
    try {
        const { client_secret, client_id } = stravaKeys;
        const url = `https://www.strava.com/oauth/token?client_id=${client_id}&client_secret=${client_secret}&grant_type=refresh_token&refresh_token=${refreshToken}`;
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
        await firebase.saveNewToken(newTokenData);
        return data.access_token;
    } catch (error) {
        throw new Error(error);
    }
};

const fetchDetailedEntry = async (activityID: number) => {
    const url = `${baseURL}activities/${activityID}`;
    try {
        const accessToken = await getAccessToken();
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
        throw new Error(error);
    }
};
