import { ApolloError } from 'apollo-server-express';
import { findStats } from '../mongoDB';
import makeStatID from '../utils/makeStatID';
import { StatModel } from '../types';

export default async (
	args: { year: number; month: number; }[]
): Promise<StatModel[] | null> => {
	try {
		const stat_ids = args.map(({ month, year }) => {
			if (month && !year) {
				throw new ApolloError('year required with month');
			}
			return makeStatID(year, month);
		});
		const findFilter = [...new Set(stat_ids)].map((stat_id) => {
			return { stat_id };
		});
		const stat = await findStats(findFilter);
		return stat;
	} catch (error) {
		throw new ApolloError(error);
	}
};
