before(function () {
    const chai = require('chai');
    chai.should();
    chai.use(require('sinon-chai'));
    chai.use(require('chai-like'));

    const admin = require('firebase-admin');
    require('firebase-functions-test')();
    if (!admin.apps || admin.apps.length === 0) admin.initializeApp();
});

// const initTests = () => {
//     const chai = require('chai');
//     chai.should();
//     chai.use(require('sinon-chai'));
//     chai.use(require('chai-like'));

//     const admin = require('firebase-admin');
//     require('firebase-functions-test')();
//     if (!admin.apps || admin.apps.length === 0) admin.initializeApp();
// };
// initTests();
