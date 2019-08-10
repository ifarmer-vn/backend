const {createIndices} = require("./createIndices");
const {migrateData} = require("./migrateData");
const {getCollections} = require("../../../mongodb/index");

async function main() {
    return new Promise(resolve => {
        let promises = [];
        // let data = require("../../../../temp/data");
        // migrateData(data);
        let data;
        getAllDataFromCMS();
        createAllIndices();
        Promise.all(promises).then(() => {
            migrateData(data);
            resolve();
        });

        function getAllDataFromCMS() {
            const collections = ["articles", "categories", "products", "articlecategories", "variants", "varianttypes"];
            promises.push(getCollections(collections).then(res => {
                data = res;
            }));
        }

        function createAllIndices() {
            const indices = [
                require("../indices/article-categories"),
                require("../indices/articles"),
                require("../indices/categories"),
                require("../indices/products"),
                require("../indices/variant-types"),
                require("../indices/variants"),
            ];
            promises.push(createIndices(indices));

        }
    });
}

console.time("Process");
console.log("Process start");
main().then(() => {
    console.timeEnd("Process");
});

