const R = require("ramda");
const {createIndices} = require("./createIndices");
const utils = require("../../../utils");
const {migrateData} = require("./migrateData");

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
            promises.push(getDataByContentTypes(contentTypes).then(res => {
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
                require("../indices/pages"),
            ];
            promises.push(createIndices(indices));

        }
    });
}

function transformData(data) {
    transformVariants(data);
    transformArticles(data);
}
function transformVariants(data){
    let variants = data.variants;
    const products = data.products;
    const categories = data.categories;
    variants.map(variant => {
        let product = R.find(R.propEq('url', variant.product))(products);

        if (product) {
            let category = R.find(R.propEq('url', product.category))(categories);
            variant.category = product.category;
            variant.productSource = {
                url: product.url,
                title: product.title.trim()
            };
            if(category){
                variant.categorySource = {
                    url: product.category,
                    title: category.name.trim()
                };
            }else {
                variant.categorySource = {};
                console.log("missing category", variant.url, variant.product);
            }

        } else {
            variant.productSource = {};
            console.log("missing prod", variant.url, variant.product);
        }
    });
}
function transformArticles(data){
    let articles = data.articles;
    const articlecategories = data.articlecategories;
    articles.map(article => {
        let articleCategory = R.find(R.propEq('url', article.category))(articlecategories);
        if(article.related_products){
            article.related_products = [];
        }

        if(article.related_articles){
            article.related_articles = [];
        }

        if (articleCategory) {
            article.articleCategorySource = {
                url: articleCategory.category,
                title: category.name.trim()
            };
        } else {
        }
    });
}



console.time("Process");
console.log("Process start");

main().then(() => {
    console.timeEnd("Process");
});

