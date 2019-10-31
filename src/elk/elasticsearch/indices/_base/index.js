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
const deleteIndex = index => {
    console.log("deleteIndices", index);
    return client.indices.delete({
        index: index,
    });
};

const scrollScan = index => query => {
    return new Promise(resolve => {
        let allRecords = [];
        client.search({
            index: index,
            scroll: '10s',
            body: {
                query
            },
            size: 1000
        }, function getMoreUntilDone(error, response) {
            // collect all the records
            if (error) {
                console.log(error);
            }
            allRecords = allRecords.concat(response.hits.hits);
            if (response.hits.total.value !== allRecords.length) {
                client.scroll({
                    scroll: '10s',
                    scrollId: response._scroll_id,
                }, getMoreUntilDone);
            } else {
                resolve(allRecords);
                console.log('get', index, allRecords.length);
            }
        });
    });
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
        delete doc.keywords;
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
    scrollScan,
    deleteIndex,
    createDocument,
    v,
    createBulk,
    pushBulk
};


module.exports = revealed;
