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
    activity(id: "5fd818d39171ea57e0d38c76")
}`,
    name: 'Query Activity By ID',
};

const stat = {
    endpoint: config.playground.url,
    query: `query {
    stat(year:2020, month:11)
}`,
    name: 'Query Stat',
};

const stats = {
    endpoint: config.playground.url,
    query: `query {
    stats(stats:[{year:2020, month:11},{year:0}])
}`,
    name: 'Query Stats',
};

export default {
    tabs: [allActivities, activityByIdConfig, stat, stats],
    endpoint: config.playground.url,
    settings: { 'schema.polling.enable': false },
};
