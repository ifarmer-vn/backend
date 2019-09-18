const schema = require("./mapping");
const base = require("../_base/index");
const index = "pages" + base.v();

const mapping = () => base.mapping(index)(schema);

const createDocument = (doc) => base.createDocument(index)(doc);
const createBulk = (doc) => base.createBulk(index)(doc);

const revealed = {
	mapping,
	createBulk,
	createDocument

};

module.exports = revealed;
