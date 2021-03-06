const schema = require("./mapping");
const base = require("../_base/index");
const index = "article-categories" + base.v();

const mapping = () => base.mapping(index)(schema);
const deleteIndex = () => base.deleteIndex(index);

const createDocument = (doc) => base.createDocument(index)(doc);
const createBulk = (doc) => base.createBulk(index)(doc);

const revealed = {
    mapping,
    deleteIndex,
    createDocument,
    createBulk
};

module.exports = revealed;
