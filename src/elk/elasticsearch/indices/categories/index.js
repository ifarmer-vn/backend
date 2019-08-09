const schema = require("./mapping");
const base = require("../_base/index");
const index = "categories" + base.v();

const mapping = () => base.mapping(index)(schema);

const createDocument = (doc) => base.createDocument(index)(doc);

const revealed = {
	mapping,
	createDocument
};


module.exports = revealed;
