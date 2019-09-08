const categories = require("./categories");
const data = require("../../data-examples/ifarmer").categories;

const migrate = () => categories.createAll(data);

module.exports = {
    migrate
};
