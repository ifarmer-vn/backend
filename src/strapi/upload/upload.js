const request = require("request");
const fs = require("fs");
const contentName = "upload/files";
const contentType = require("../_base/content-type");
const getAll = contentType.getAll(contentName);
const deleteAll = contentType.deleteAll(contentName);

const getName = () => {
    return contentName;
};

const revealed = {
    getName,
    getAll,
    deleteAll,
};
module.exports = revealed;
