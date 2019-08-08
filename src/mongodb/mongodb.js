const credential = require("./credential");

const MongoClient = require('mongodb').MongoClient;

const uri = credential.uri;
const mongodb = () => {
    return new Promise(resolve => {
        const client = new MongoClient(uri, {useNewUrlParser: true});
        console.log("contect DB");
        client.connect(err => {
            console.log("contected");
            const collection = client.db("strapi").collection("articles");
            // perform actions on the collection object
            collection.find().forEach(function (item) {
                console.log(item);
                // If the item is null then the cursor is exhausted/empty and closed
                if (item == null) {
                  //  client.close(); // you may not want to close the DB if you have more code....
                    return;
                }
                // otherwise, do something with the item
            });
        });
    });
};

const revealed = {
    connect: mongodb
};

module.exports = revealed;
