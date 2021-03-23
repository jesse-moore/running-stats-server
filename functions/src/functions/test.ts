import { Response } from 'firebase-functions';
import { Request } from 'firebase-functions/lib/providers/https';
import { connectMongoose, closeMongoose } from '../mongoDB';
import calcStats from '../utils/calcStats';
import Activity from '../mongoDB/models/activity';
import Stat from '../mongoDB/models/stat';
import getActivityWeather from '../helpers/getActivityWeather';

export default async function (req: Request, res: Response): Promise<void> {
    try {
        await connectMongoose();
        const activities = await Activity.find({ 'weather.maxTemp': null });
        for await (const activity of activities) {
            if (!activity || !activity.weather) continue;
            try {
                const weather = await getActivityWeather(activity);
                activity.weather = weather;
                await activity.save();
            } catch (error) {
                console.log(`Failed to Update ${activity.strava_id}`);
                console.log(error.message);
            }
        }
        res.status(200);
        res.json({});
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    } finally {
        await closeMongoose();
    }
}
