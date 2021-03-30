import { Response } from 'firebase-functions';
import { Request } from 'firebase-functions/lib/providers/https';
import { connectMongoose, closeMongoose } from '../mongoDB';
import Activity from '../mongoDB/models/activity';
import Stat from '../mongoDB/models/stat';
import getActivityWeather from '../helpers/getActivityWeather';
import fetchActivity from '../strava/fetchActivity';
import { getStravaAccessToken } from '../strava';
import idMap from '../../test_db/idMap.json';
import { bestEffortsJSON } from '../../test_db/bestEfforts.json';
import mongoose from 'mongoose';
const fs = require('fs');

export default async function (req: Request, res: Response): Promise<void> {
    try {
        await connectMongoose();
        // const activities = await Activity.countDocuments();
        // { $rename: { 'weather.precip_': 'weather.precip' } },
        // { upsert: false, multi: true }

        // console.log(activities);
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.status(500);
        res.send(error.message);
    } finally {
        await closeMongoose();
    }
}

function readActivities() {
    try {
        // const rawData = fs.readFileSync(`./activities/all.json`, 'utf8');
        const rawData = fs.readFileSync('./test_db/all.json', 'utf8');
        return JSON.parse(rawData);
    } catch (error) {
        console.error(error.name);
        console.error(error.message);
    }
}
