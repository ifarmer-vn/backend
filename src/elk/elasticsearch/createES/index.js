const indices = [
    require("../indices/article-categories"),
    require("../indices/articles"),
    require("../indices/categories"),
    require("../indices/products"),
    require("../indices/variant-types"),
    require("../indices/variants"),
];

const createAllMapping = () => {
    return new Promise(resolve => {
        let promises = [];
        indices.map(index => {
            promises.push(createMapping(index));
        });
        Promise.all(promises).then(() => {
            resolve();
        })
    });
};

const createMapping = async (index) => {
    return await index.mapping();
};

async function main() {
    await createAllMapping();
}

main();

