const R = require("ramda");
const {createIndices, deleteIndices} = require("./createIndices");
const utils = require("../../../utils");
const {migrateData} = require("./migrateData");
const {transformData} = require("./transformData");

const {getDataByContentTypes} = require("../../../strapi/strapi");

const contentTypes = [
    require("../../../strapi/article-categories/article-categories"),
    require("../../../strapi/articles/articles"),
    require("../../../strapi/categories/categories"),
    require("../../../strapi/products/products"),
    require("../../../strapi/variant-types/variant-types"),
    require("../../../strapi/variants/variants"),
    require("../../../strapi/pages/pages"),
];
const indices = [
    require("../indices/article-categories"),
    require("../indices/articles"),
    require("../indices/categories"),
    require("../indices/products"),
    require("../indices/variant-types"),
    require("../indices/variants"),
    require("../indices/pages"),
];

async function main() {
    return new Promise(async resolve => {
        let promises = [];
        // let data = require("../../../../temp/data");
        // migrateData(data);
        let data;
        await deleteIndices(indices);
        getAllDataFromCMS();
        createAllIndices();
        Promise.all(promises).then(() => {
            transformData(data);
            migrateData(data);
            resolve();
        });

        function getAllDataFromCMS() {
            promises.push(getDataByContentTypes(contentTypes).then(res => {
                data = res;
                utils.saveDataToFile('cms-data.json', data);
            }));
        }

        function createAllIndices() {
            promises.push(createIndices(indices));

        }
    });
}

console.time("Process");
console.log("Process start");

main().then(() => {
    console.timeEnd("Process");
});
