const categories = require("./categories");

describe("categories", () => {
    describe("create", () => {
        it("should return correct data", async () => {
            const category = {
                url1: "ca-bien1"
            };
            const output = await categories.create(category);
            expect({}).toEqual(output);
        });
    });

    describe("mapping", () => {
        it("should return correct data", () => {
            const category = {
                id: "ca-bien"
            };
            const expected = {
                url: "ca-bien"
            };
            const output = categories.mapping(category);
            expect(expected).toEqual(output);
        });
    });
});