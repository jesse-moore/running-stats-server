import config from './config';

const activityByIdConfig = {
    endpoint: config.playground.url,
    query: `query {
    activity(id: "5fc8f28af337e95940523170")
}`,
    name: 'Query Activity By ID',
};

export default {
    tabs: [activityByIdConfig],
    settings: { 'schema.polling.enable': false },
};
