import config from './config';

const allActivities = {
    endpoint: config.playground.url,
    query: `query {
    activities(page:0, perPage:30, year:2020, month:10)
}`,
    name: 'Query All Activities',
};

const activityByIdConfig = {
    endpoint: config.playground.url,
    query: `query {
    activity(id: "5fb31814bb4d763eb869850a")
}`,
    name: 'Query Activity By ID',
};

export default {
    tabs: [allActivities, activityByIdConfig],
    settings: { 'schema.polling.enable': false },
};
