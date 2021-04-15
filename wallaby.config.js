module.exports = function (wallaby) {
    const path = require('path');
    process.env.NODE_PATH +=
        path.delimiter +
        path.join(wallaby.localProjectDir, 'functions', 'node_modules');
    return {
        files: [
            'functions/src/**/*.*',
            'functions/src/utils/*.*.*',
            'functions/tests/data/*.*',
            'functions/tests/helpers/*.ts',
        ],

        tests: ['functions/tests/unit_tests/**/*test.ts'],
        env: {
            type: 'node',
            runner: 'node',
        },
        setup: (wallaby) => {
            const chai = require('chai');
            chai.should();
            chai.use(require('sinon-chai'));
            chai.use(require('chai-like'));

            const admin = require('firebase-admin');
            require('firebase-functions-test')();
            if (!admin.apps || admin.apps.length === 0) admin.initializeApp();

            global.expect = require('chai').expect;
        },
        testFramework: 'mocha',
        filesWithNoCoverageCalculated: [
            'functions/src/utils/errorHandler.ts',
            'functions/src/graphql/schema.ts',
            'functions/tests/data/*.*',
            'functions/tests/helpers/*.ts',
        ],
        runMode: 'onsave',
        trace: true,
    };
};
