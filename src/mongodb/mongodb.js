const credential = require("./credential");

const MongoClient = require('mongodb').MongoClient;

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
    await deleteALlQACollections();
    for (let pp in collections) {
        let data = collections[pp];
        await createQACollection(pp);
        await insertDataQACollection(pp, data);
    }
};

const deleteALlQACollections = async () => {
    let promises = [];
    const collections = await getALlCollections(uriQA);
    collections.map(col => {
        promises.push(deleteQACollection(col));
    });
    return Promise.all(promises);
};

const createQACollections = async (collections) => {
    let promises = [];
    collections.map(col => {
        promises.push(createQACollection(col));
    });
    return Promise.all(promises);
};


const createQACollection = async (name) => {
    return new Promise(async resolve => {
        const repo = await connectQA();
        repo.db.createCollection(name, function (err, res) {
            if (err) throw err;
            console.log("Collection created!");
            resolve(name);
            repo.client.close();
        });
    });
};
const insertDataQACollection = async (name, data) => {
    let promises = [];
    const repo = await connectQA();
    data.map(item => {
        promises.push(insertOneCollection(repo.db, name, item));
    });
    return Promise.all(promises);
};
const insertOneCollection = async (db, name, item) => {
    return new Promise(resolve => {
        db.collection(name).insertOne(item, function (err, res) {
            if (err) throw err;
            resolve();
        });
    });
};

const deleteQACollection = async (name) => {
    return new Promise(async resolve => {
        const repo = await connectQA();
        console.log("Deleting", name);
        // repo.client.close();
        // return;
        return repo.db.collection(name).drop((err, delOK) => {
            if (err) throw err;
            if (delOK)
                console.log("Collection deleted", name);
            repo.client.close();
            resolve(name);
        });

    });
};

const getAllData = async () => {
    const collections = await getALlCollections(uriProd);
    return await getCollections(collections);
};

const getALlCollections = async (urlDB) => {
    return new Promise(async resolve => {
        const repo = await connect(urlDB);
        repo.db.listCollections().toArray(function (err, collInfos) {
            if (err) {
                console.log(err);
            }
            let result = [];
            collInfos.map(col => {
                result.push(col.name);
            });
            repo.client.close();
            resolve(result);
        });
    });
};


const revealed = {
    connect: connectProd,
    getCollections,
    getAllData,
    restoreData
};

module.exports = revealed;
