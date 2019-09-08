const R = require("ramda");
const {createIndices} = require("./createIndices");
const utils = require("../../../utils");
const {migrateData} = require("./migrateData");

const {getAllData} = require("../../../strapi/strapi");


// transformData(require('../../../../cms-data'));

async function main() {
    return new Promise(resolve => {
        let promises = [];
        // let data = require("../../../../temp/data");
        // migrateData(data);
        let data;
        getAllDataFromCMS();
        createAllIndices();
        Promise.all(promises).then(() => {
            transformData(data);
            migrateData(data);
            resolve();
        });

        function getAllDataFromCMS() {
            promises.push(getAllData().then(res => {
                data = res;
                utils.saveDataToFile('cms-data.json', data);
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
function transformData(data) {
    let variants = data.variants;
    const products = data.products;
    variants.map(variant => {
        let product = R.find(R.propEq('url', variant.product))(products);
        if (product) {
            variant.source = {
                product: {
                    url: product.url,
                    title: product.title.trim()
                }
            };
            // console.log("variant", variant.source);
        } else {
            console.log("missing prod", variant.url, variant.product);
        }
    });
}
console.time("Process");
console.log("Process start");

main().then(() => {
    console.timeEnd("Process");
});

