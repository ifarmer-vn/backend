const schema = require("./mapping");
const base = require("../_base/index");
const index = "articles" + base.v();

const mapping = () => base.mapping(index)(schema);

const createDocument = (doc) => base.createDocument(index)(doc);
const createBulk = (doc) => base.createBulk(index)(doc);

const revealed = {
	mapping,
	createDocument,
	createBulk
};

module.exports = revealed;
