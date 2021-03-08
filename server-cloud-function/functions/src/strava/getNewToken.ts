import axios from 'axios';
import { saveNewToken } from '../firebase';
import { STRAVA_CLIENT_ID, STRAVA_CLIENT_SECRET } from '../keys.json';

export default async (refreshToken: string): Promise<string> => {
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
