const strapi = require("./strapi");
const migrateAll = [
    require("./categories/migrate"),
    require("./articles/migrate"),
    require("./article-categories/migrate"),
    require("./products/migrate"),
    require("./variant-types/migrate"),
    require("./variants/migrate"),
];
const deleteData = [
    require("./article-categories/article-categories"),
    require("./articles/articles"),
    require("./categories/categories"),
    require("./products/products"),
    require("./variant-types/variant-types"),
    require("./variants/variants"),
    require("./upload/upload"),
];
async function main() {
    await strapi.deleteAllData(deleteData);
    await strapi.migrateFirebase(migrateAll);
}
console.time("Start migrate firebase to strapi");

main().then(()=>{
    console.timeEnd("Start migrate firebase to strapi");
});