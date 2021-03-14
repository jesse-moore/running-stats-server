import { getStravaAccessToken } from '../firebase';
import getNewToken from './getNewToken';

export default async (): Promise<string> => {
    const {
        accessToken,
        expiresAt,
        refreshToken,
    } = await getStravaAccessToken();
    const currentDateUnix = new Date().valueOf();
    const expiredDateUnix = expiresAt * 1000;
    if (expiredDateUnix < currentDateUnix + 3000000) {
        const newAccessToken = await getNewToken(refreshToken);
        return newAccessToken;
    } else {
        return accessToken;
    }
};
