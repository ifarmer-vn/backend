const credential = require("./credential");
const {createTasks, executeTasks} = require("../utils");
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const uriProd = credential.uri;
const uriQA = credential.uriQA;

const connectProd = () => {
    return connect(uriProd);
};
const connectQA = () => {
    return connect(uriQA);
};
const connect = (uri) => {
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
        const repo = await connectProd();
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

const restoreData = async (collections) => {
    const repo = await connectQA();
    await deleteALlCollections(repo);
    for (let pp in collections) {
        let data = collections[pp];
        await createCollection(pp, repo);
        await insertDataQACollection(pp, data, repo);
    }
};

const restoreProdData = async (collections) => {
    const repo = await connectProd();
    await deleteALlCollections(repo);
    for (let pp in collections) {
        let data = collections[pp];
        await createCollection(pp, repo);
        await insertDataQACollection(pp, data, repo);
    }
};

const deleteALlCollections = async (repo) => {
    let promises = [];
    const collections = await getALlCollections(repo);
    collections.map(col => {
        promises.push(deleteCollection(col, repo));
    });
    return Promise.all(promises);
};

const createCollection = async (name, repo) => {
    return new Promise(async resolve => {
        repo.db.createCollection(name, function (err, res) {
            if (err) throw err;
            console.log("Collection created!", name);
            resolve(name);
        });
    });
};

const insertDataQACollection = async (name, data, repo) => {
    console.log("insert ", name, data.length);
    let tasks = [];
    const insertTask = createTasks(tasks);
    data.map(item => insertTask(async () => {
        await insertOneCollection(repo.db, name, item)
    }));
    return await executeTasks(tasks, {});
};

const insertOneCollection = async (db, name, item) => {
    return new Promise(resolve => {
        item._id = ObjectID(item._id);
        if(item.related && item.related[0] && item.related[0]._id){
            item.related[0]._id = ObjectID(item.related[0]._id);
            item.related[0].ref = ObjectID(item.related[0].ref);
        }
        db.collection(name).insertOne(item, function (err, res) {
            if (err) throw err;
            resolve();
        });
    });
};

const deleteCollection = async (name, repo) => {
    return new Promise(async resolve => {
        return repo.db.collection(name).drop((err, delOK) => {
            if (err) throw err;
            if (delOK)
                console.log("Collection deleted", name);
            resolve(name);
        });

    });
};

const getAllData = async () => {
    const repo = await connectProd();
    const collections = await getALlCollections(repo);
    repo.client.close();
    return await getCollections(collections);
};

const getALlCollections = async (repo) => {
    return new Promise(async resolve => {
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
    connect: connectProd,
    getCollections,
    getAllData,
    restoreData,
    restoreProdData
};

module.exports = revealed;
