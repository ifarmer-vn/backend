const articles = require("./articles");
const data = require("../../data-examples/ifarmer").articles;

const migrate = () => articles.createAll(data);

module.exports = {
    migrate
};
