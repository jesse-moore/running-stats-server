import { ApolloError } from 'apollo-server-express';
import { findAvailableStats } from '../mongoDB';

export default async () => {
	try {
		const result = await findAvailableStats();
		return result[0].result;
	} catch (error) {
		throw new ApolloError(error);
	}
};
