const client = require("../../ES");
const {version} = require("../../../config/elasticsearch");

const v = () => version;
const mapping = index => schema => {
    return client.indices.create({
            index: index,
            body: schema
        },
        (err, resp, respcode) => {
            console.log(err, resp, respcode);
        })
};

const createDocument = index => doc => {
    const body = [{index: {_index: index}}, doc];
    return client.bulk({
            index: index,
            body: body
        },
        (err, resp, respcode) => {
            if (err && err.toJSON) {
                console.log(err);
            }
            // console.log(respcode);
        })
};
const createBulk = index => docs => {
    let bulks = [];
    for (let i = 0; i < docs.length; i++) {
        let doc = docs[i];
        bulks.push({create: {_index: index, _id: i}});
        doc.id = doc._id;
        delete doc._id;
        bulks.push(doc);
    }
    if (bulks.length > 0) {
        pushBulk(bulks);
    }
    return bulks;
};
const pushBulk = bulks => {
    return client.bulk(
        {
            body: bulks
        }, function (err, resp) {
            if (err) {
                console.log(err.response);
            }
        });
};

const revealed = {
    mapping,
    createDocument,
    v,
    createBulk,
    pushBulk
};


module.exports = revealed;
