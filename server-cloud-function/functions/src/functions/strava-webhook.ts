import express from 'express';
import { validateStravaID } from '../utils/validateStravaID';
import { addIDToQueue } from '../firebase';
import keys from '../keys.json';

function server() {
    const app = express();

    app.use(express.json());

    app.get('/', (req, res) => {
        const { VERIFY_TOKEN } = keys;

        const mode = req.query['hub.mode'];
        const token = req.query['hub.verify_token'];
        const challenge = req.query['hub.challenge'];

        if (mode && token) {
            if (mode === 'subscribe' && token === VERIFY_TOKEN) {
                console.log('WEBHOOK_VERIFIED');
                res.json({ 'hub.challenge': challenge });
            } else {
                res.sendStatus(403);
            }
        } else {
            res.sendStatus(400);
        }
    });

    app.post('/', async (req, res) => {
        const { object_type, object_id, aspect_type } = req.body;
        console.log(req.hostname);
        if (
            object_type === 'activity' &&
            aspect_type === 'create' &&
            validateStravaID(object_id)
        ) {
            await addIDToQueue(object_id);
            res.sendStatus(200);
        } else {
            res.sendStatus(200);
        }
    });

    return app;
}

export default server();
