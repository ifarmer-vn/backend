const credential = require("./credential");

const MongoClient = require('mongodb').MongoClient;

const uri = credential.uri;
const connect = () => {
    return new Promise(resolve => {
        const client = new MongoClient(uri, {useNewUrlParser: true});
        console.log("connect to Mongo DB");
        client.connect(err => {
            const db = client.db("strapi");

            resolve({client, db});
        });
    });
};
const getCollections = collections => {
    return new Promise(async resolve => {
        const repo = await connect();
        const promises = [];
        const results = {};
        collections.map(async collection => {
            promises.push(getCollectionData(repo.db, collection).then(data => {
                results[collection] = data;
            }));
        });
        Promise.all(promises).then(() => {
            repo.client.close();
            resolve(results);
        });
    });
};
const getCollectionData = (db, name) => {
    return new Promise(resolve => {
        const promises = [];
        const collection = db.collection(name);
        const result = [];
        console.log("getCollectionData", name);
        promises.push(collection.find().forEach(function (item) {
            // delete item._id;
            result.push(item);
            // console.log(item.url);
        }));
        Promise.all(promises).then(() => {
            resolve(result);
        });
    });

};

const getAllData = async () => {
    const collections = await getALlCollections();
    return await getCollections(collections);
};

const getALlCollections = async () => {
    return new Promise(async resolve => {
        const repo = await connect();
        repo.db.listCollections().toArray(function (err, collInfos) {
            if (err) {
                console.log(err);
            }
            let result = [];
            collInfos.map(col => {
                result.push(col.name);
            });
            resolve(result);
        });
    });
};


const revealed = {
    connect,
    getCollections,
    getAllData
};

module.exports = revealed;
