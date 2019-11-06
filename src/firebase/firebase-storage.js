const admin = require("firebase-admin");
const credential = require("./credential");

const firebaseStorage = admin.initializeApp({
	credential: admin.credential.cert(require('./credentials/server')),
	storageBucket: credential.storageBucket,
}, 'server');

Object.freeze(firebaseStorage);

module.exports = firebaseStorage;
