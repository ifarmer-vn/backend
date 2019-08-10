const client = require("../../ES");
const {version} = require("../../../config/elasticsearch");

const v = () => version;
const mapping = index => schema => {
    client.indices.create({
            index: index,
            body: schema
        },
        (err, resp, respcode) => {
            console.log(err, resp, respcode);
        })
};

const createDocument = index => doc => {
    client.index({
            index: index,
            body: doc
        },
        (err, resp, respcode) => {
            if (err && err.toJSON) {
                console.log("Test");
                console.log(err);
            }
        })
};

const revealed = {
    mapping,
    createDocument,
    v,
};


module.exports = revealed;
