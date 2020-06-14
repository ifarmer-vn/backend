const offers = require("./offers");
const data = require("../../data-examples/ifarmer").offers;

const migrate = () => offers.createAll(data);

module.exports = {
    migrate
};
