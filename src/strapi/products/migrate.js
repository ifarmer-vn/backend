const products = require("./products");
const data = require("../../data-examples/ifarmer").products;

const migrate = () => products.createAll(data);

module.exports = {
    migrate
};
