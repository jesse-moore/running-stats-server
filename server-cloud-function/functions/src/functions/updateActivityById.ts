// import { Change, EventContext, firestore } from 'firebase-functions';
import { getIDQueue, removeIDFromQueue, clearIDQueue } from '../firebase/index';
import { connectMongoose, closeMongoose, getIndexMap } from '../mongoDB';
import statusLogger from '../utils/statusLogger';
import { IdQueue } from '../types';

import { Request, Response } from 'firebase-functions';
import { getNewActivities, updateStats } from '../helpers';
import { MongoError } from 'mongodb';

async function server2(req: Request, res: Response) {
    const data = await server();
    if (data) {
        res.json(data);
    } else {
        res.sendStatus(200);
    }
}

async function server(): Promise<any> {
    try {
        statusLogger.init();
        // TODO get only recently added ids from idQueue
        const idQueueDoc = await getIDQueue();
        const idQueue: IdQueue | undefined = idQueueDoc.data();
        if (!idQueue || !idQueue.ids || idQueue.ids.length < 1) return;

        await connectMongoose();
        const indexMap = await getIndexMap();

        const newIdsQueue: number[] = [];
        for await (const id of idQueue.ids) {
            if (indexMap.index.has(id.toString())) {
                await removeIDFromQueue(id);
                console.warn(`Duplicate activity found in IDQueue - id: ${id}`);
            } else {
                newIdsQueue.push(id);
            }
        }
        if (newIdsQueue.length === 0) return;

        const activities = await getNewActivities(newIdsQueue);
        const stats = await updateStats(activities);

        for await (const activity of activities) {
            await activity
                .save({ validateBeforeSave: false })
                .catch((error: MongoError) => {
                    console.error(
                        `Failed to save activity: ${activity.strava_id}`
                    );
                    statusLogger.addDatabaseError(error);
                    throw Error();
                });
        }

        for await (const stat of stats) {
            await stat
                .save({ validateBeforeSave: false })
                .catch((error: MongoError) => {
                    console.error(`Failed to save stat: ${stat.id}`);
                    statusLogger.addDatabaseError(error);
                    throw Error();
                });
        }

        await clearIDQueue();
        return;
    } catch (error) {
        if (error.message) {
            console.error(error.message);
        }
        return;
    } finally {
        await closeMongoose();
        statusLogger.logStatus();
    }
}

export default server2;
