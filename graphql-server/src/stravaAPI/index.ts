import axios from 'axios';
const firebase = require('../firebase');
const stravaKeys = require('./strava.key.json');
import {
    connectMongoose,
    closeMongoose,
    insertManyEntries,
    insertManyStats,
    getActivities,
} from '../mongoDB';
import { baseURL } from './constants';
import { ApolloError } from 'apollo-server';
import { parseEntries } from './validation';
import { EntryType } from '../types';

import { calcStats } from './helpers';
import activities from '../data';

export const initializeStats = async () => {
    try {
        await connectMongoose();
        const activities = await getActivities();
        const stats = calcStats(activities);
        // const parsedEntries = parseEntries(activities);
        // console.log(JSON.stringify(parsedEntries));
        // console.log(activities[0]);
        await insertManyStats(stats);
        closeMongoose();
        return stats;
    } catch (error) {
        console.log(error);
    }
};

export const initializeEntries = async (): Promise<void> => {
    const accessToken = await getAccessToken();
    await connectMongoose();
    const allInvalidEntries = [];
    let page = 1;
    do {
        const entries = await fetchEntries(accessToken, 20, page);
        if (entries.length === 0) break;
        const { validEntries, invalidEntries } = parseEntries(entries);
        allInvalidEntries.push(...invalidEntries);
        // Save entries to DB
        await insertManyEntries(validEntries);
        console.log(`Inserted ${validEntries.length} Entries`);
        console.log(`Found ${invalidEntries.length} Invalid Entries`);
        page++;
        await new Promise((resolve) => setTimeout(resolve, 2000));
    } while (page < 2);
    closeMongoose();
    console.log(`Invalid Entries:\n`, allInvalidEntries);
};

const fetchEntries = async (
    accessToken: string,
    perPage: number = 1,
    page: number = 1
): Promise<EntryType[]> => {
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
        throw new ApolloError(error);
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
