const strapi = require("./strapi");

async function main() {
    await strapi.deleteAllData();
    await strapi.migrateFirebase();
}
console.time("Start migrate firebase to strapi");

main().then(()=>{
    console.timeEnd("Start migrate firebase to strapi");
});