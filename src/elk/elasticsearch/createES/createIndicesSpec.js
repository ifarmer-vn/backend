const createIndices = require("./createIndices");
describe("createIndices", () => {
    describe("createAllMapping", () => {
        it("should mapping correctly", async () => {
            const indices = [
                require("../indices/categories"),
            ];
            await createIndices.createIndices(indices);
        });
    });
});
