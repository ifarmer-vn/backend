const articleCategories = require("../indices/article-categories");
const articles = require("../indices/articles");
const categories = require("../indices/categories");
const products = require("../indices/products");
const variantTypes = require("../indices/variant-types");
const variants = require("../indices/variants");

const migrateData = async (data) => {
    pushDataToES(categories)(data.categories);
    pushDataToES(articleCategories)(data.articlecategories);
    pushDataToES(articles)(data.articles);
    pushDataToES(products)(data.products);
    pushDataToES(variantTypes)(data.varianttypes);
    pushDataToES(variants)(data.variants);
};

const pushDataToES = index => async docs => {
    let count = 0;
    console.log("start add", docs.length);
    index.createBulk(docs);
};

const revealed = {
    migrateData,
    pushDataToES
};

module.exports = revealed;
