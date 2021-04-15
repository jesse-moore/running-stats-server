import { ApolloError } from 'apollo-server-express';
import { findStat } from '../mongoDB';
import makeStatID from '../utils/makeStatID';
import { StatModel } from '../types';

export default async ({
	year,
	month,
}: {
	year: number;
	month: number;
}): Promise<StatModel | null> => {
	try {
		if (month && !year) {
			throw new ApolloError('year required with month');
		}
		const stat_id = makeStatID(year, month);
		const stat = await findStat(stat_id);
		if (!stat)
			return null;
		return stat;
	} catch (error) {
		throw new ApolloError(error);
	}
};
