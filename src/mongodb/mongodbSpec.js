const mongodb = require("./mongodb");
describe("mongodb", () => {
    describe("connect", () => {
        fit("should return correct data", async () => {

           await mongodb.connect();
        });
    });
});