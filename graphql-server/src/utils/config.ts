require('dotenv').config();

const MONGODB_URI =
    process.env.NODE_ENV === 'production'
        ? process.env.MONGODB_URI
        : process.env.TEST_MONGODB_URI;

export default { MONGODB_URI };
