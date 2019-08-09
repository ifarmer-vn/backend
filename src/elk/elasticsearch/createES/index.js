const productsIndex = require("../indices/products");
const categoriesIndex = require("../indices/categories");
const articlesIndex = require("../indices/articles");
const variantsIndex = require("../indices/variants");

// const  = require("../_data/");

const createMapping = async () => {
	await categoriesIndex.mapping();
	await productsIndex.mapping();
	await articlesIndex.mapping();
	await variantsIndex.mapping();
};

async function main() {
	await createMapping();
}

main();

