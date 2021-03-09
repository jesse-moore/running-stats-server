import { Change } from 'firebase-functions';
import { removeIDFromQueue } from '../firebase/index';
import { connectMongoose, closeMongoose, getIndexSet } from '../mongoDB';
import statusLogger from '../utils/statusLogger';
import getNewIds from '../utils/getNewIds';

import { getNewActivities, updateStats } from '../helpers';
import { MongoError } from 'mongodb';
import { QueryDocumentSnapshot } from 'firebase-functions/lib/providers/firestore';

async function server(change: Change<QueryDocumentSnapshot>): Promise<void> {
    try {
        statusLogger.init();
        const idQueue = getNewIds(change);

        if (!idQueue || idQueue.length === 0) return;
        await connectMongoose();
        const indexSet = await getIndexSet();

        const newIdsQueue: number[] = [];
        for await (const id of idQueue) {
            if (indexSet.has(id)) {
                await removeIDFromQueue(id);
                console.warn(`Duplicate activity found in IDQueue - id: ${id}`);
            } else {
                newIdsQueue.push(id);
            }
        }
        if (newIdsQueue.length === 0) return;
        // throw new Error('BREAK');

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

        const savedIds = activities.map((a) => a.strava_id);
        await removeIDFromQueue(savedIds);
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

export default server;
