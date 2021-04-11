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
            // const mocha = wallaby.testFramework;

            const chai = require('chai');
            chai.should();
            // const sinon = require('sinon');

            chai.use(require('sinon-chai'));
            chai.use(require('chai-like'));

            // setup sinon hooks
            // mocha.suite.beforeEach('sinon before', function () {
            //     if (null == this.sinon) {
            //         this.sinon = sinon.createSandbox();
            //     }
            // });
            // mocha.suite.afterEach('sinon after', function () {
            //     if (this.sinon && 'function' === typeof this.sinon.restore) {
            //         this.sinon.restore();
            //     }
            // });

            global.expect = require('chai').expect;
        },
        testFramework: 'mocha',
        filesWithNoCoverageCalculated: ['functions/src/utils/errorHandler.ts'],
        runMode: 'onsave',
    };
};
