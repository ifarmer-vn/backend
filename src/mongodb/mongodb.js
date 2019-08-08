const credential = require("./credential");

const MongoClient = require('mongodb').MongoClient;

const uri = credential.uri;
const connect = () => {
    return new Promise(resolve => {
        const client = new MongoClient(uri, {useNewUrlParser: true});
        console.log("contect DB");
        client.connect(err => {
            console.log("contected");
            const db = client.db("strapi");
            // .collection("articles");
            // perform actions on the collection object

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
            promises.push(getAllCollection(repo.db, collection).then(data => {
                results[collection] = data;
            }));
        });
        Promise.all(promises).then(() => {
            repo.client.close();
            resolve(results);
        });
    });
};
const getAllCollection = (db, name) => {
    return new Promise(resolve => {
        const promises = [];
        const collection = db.collection(name);
        const result = [];
        promises.push(collection.find().forEach(function (item) {
            result.push(item);
            // console.log(item.url);
        }));
        Promise.all(promises).then(() => {
            resolve(result);
        });
    });

};

const revealed = {
    connect,
    getCollections
};

module.exports = revealed;
