const migrateData = require("./migrateData");
const categoriesIndex = require("../indices/categories");

const categories = require("../../../../temp/categories");
describe("migrateData", () => {
    describe("pushDataToES", () => {
        fit("should return correct data", async () => {
            await migrateData.pushDataToES(categoriesIndex)(categories.categories);
        });
    });
});