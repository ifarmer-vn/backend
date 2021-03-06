const schema = require("./mapping");
const base = require("../_base/index");
const index = "variants" + base.v();

const mapping = () => base.mapping(index)(schema);
const scrollScan = base.scrollScan(index);
const deleteIndex = () => base.deleteIndex(index);

const createDocument = (doc) => base.createDocument(index)(doc);
const createBulk = (doc) => base.createBulk(index)(doc);
const updateBulk = (docs) => base.updateBulk(index)(docs);
const getAll = async () => {
	const variants = await scrollScan();
	return variants;
};



const revealed = {
    mapping,
	deleteIndex,
	createBulk,
	updateBulk,
	getAll,
    createDocument
};


module.exports = revealed;
