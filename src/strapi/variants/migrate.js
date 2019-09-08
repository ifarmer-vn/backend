const variants = require("./variants");
const data = require("../../data-examples/ifarmer").variants;

const migrate = () => variants.createAll(data);

module.exports = {
    migrate
};
