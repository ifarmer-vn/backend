const mongodb = require("./mongodb");
describe("mongodb", () => {
    describe("connect", () => {
        it("should return correct data", async () => {

           await mongodb.connect();
        });
    });
});