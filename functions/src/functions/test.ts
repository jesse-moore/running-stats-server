import { Response } from 'firebase-functions';
import { Request } from 'firebase-functions/lib/providers/https';
import { connectMongoose, closeMongoose } from '../mongoDB';
import calcStats from '../utils/calcStats';
import Activity from '../mongoDB/models/activity';
import Stat from '../mongoDB/models/stat';

export default async function (req: Request, res: Response): Promise<void> {
    try {
        await connectMongoose();
        const activities = await Activity.find({ year: 2021 });
        const stats = calcStats(activities, null);
        for await (const stat of stats) {
            if (stat.stat_id === 0 || stat.stat_id === 202100) continue;
            // await Stat.deleteOne({ stat_id: stat.stat_id });
            await stat.save();
        }
        res.status(200);
        res.json(stats);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    } finally {
        await closeMongoose();
    }
}
