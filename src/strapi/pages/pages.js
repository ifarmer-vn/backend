const contentName = "pages";
const contentType = require("../_base/content-type");
const getAll = contentType.getAll(contentName);

const getName = () => {
    return contentName;
};

const revealed = {
    getName,
    getAll,
};
module.exports = revealed;
