import { ApolloError } from 'apollo-server';
import { db } from '../firebase';

interface AccessTokenType {
    accessToken: string;
    expiresAt: number;
    refreshToken: string;
}

export const getStravaAccessToken = async (): Promise<AccessTokenType> => {
    const adminRef = db.collection('admin').doc('strava');
    const doc = await adminRef.get();
    if (!doc.exists) {
        throw new ApolloError('No strava access key found');
    } else {
        const data = doc.data();
        if (data === undefined)
            throw new ApolloError('No strava access key found');
        return {
            accessToken: data.accessToken,
            expiresAt: data.expiresAt,
            refreshToken: data.refreshToken,
        };
    }
};

export const saveNewToken = async (
    newTokenData: AccessTokenType
): Promise<void> => {
    const adminRef = db.collection('admin').doc('strava');
    await adminRef.set(newTokenData);
};
