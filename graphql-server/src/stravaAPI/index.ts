import axios from 'axios';
const firebase = require('../firebase');
const stravaKeys = require('./strava.key.json');
import { baseURL } from './constants';
import { ApolloError } from 'apollo-server';

export const getAllRuns = async (): Promise<string> => {
    try {
        const entries = await fetchEntries();
        console.log(entries);
        return JSON.stringify(entries);
    } catch (error) {
        console.log(error);
        throw new ApolloError('Error retrieving runs');
    }
};

const fetchEntries = async () => {
    // const perPage = 100;
    const url = `${baseURL}athlete/activities?per_page=1`;
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
        throw new ApolloError(error);
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
        throw new ApolloError(error);
    }
};
