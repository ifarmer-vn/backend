const contentTypes = [
    require("./article-categories/article-categories"),
    require("./articles/articles"),
    require("./categories/categories"),
    require("./products/products"),
    require("./variant-types/variant-types"),
    require("./variants/variants"),
];

const getAllData = () => {
    return new Promise(async resolve => {
        const promises = [];
        const results = {};
        // const collections = ["articles", "categories", "products", "articlecategories", "variants", "varianttypes"];
        contentTypes.map(contentType => {
            promises.push(contentType.getAll().then(data => {
                results[contentType.getName()] = data;
            }));
        });
        Promise.all(promises).then(() => {
            resolve(results);
        });
    });
};

module.exports = {
    getAllData
};
