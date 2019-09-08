const articleCategories = require("./article-categories");
const data = require("../../data-examples/ifarmer")['article-categories'];

const migrate = () => articleCategories.createAll(data);

module.exports = {
    migrate
};
