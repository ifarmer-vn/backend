const mongodb = require("./mongodb");
const fs = require("fs");

async function download() {
    const collections = ["articles", "categories", "products", "articlecategories", "variants", "varianttypes"];
    const allData = await mongodb.getCollections(collections);
    fs.writeFile("./data.json", JSON.stringify(allData), "utf8", () => {

    });
}

download();
