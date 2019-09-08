const variantTypes = require("./variant-types");
const data = require("../../data-examples/ifarmer")['variantTypes'];

const migrate = () => variantTypes.createAll(data);

module.exports = {
    migrate
};
