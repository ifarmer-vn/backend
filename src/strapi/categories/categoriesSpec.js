const categories = require("./categories");
const data = require("../../data-examples/ifarmer").categories;

describe("categories", () => {
    describe("createAll", () => {
        it("should working with dummy data", async () => {
            const cats = [
                {
                    url: "ca-bien"
                },
                {
                    url: "ca-song"
                }
            ];
            categories.createAll(cats);
        });
        it("should working with json data", async () => {
            await categories.createAll(data);
        });
    });
    describe("create", () => {
        it("should working with dummy data", async () => {
            const category = {
                url1: "ca-bien1"
            };
            await categories.create(category);
        });
        it("should working with json data", async () => {
            const category = data["rau"];
            await categories.create(category);
        });
    });
    describe("update", () => {
        it("should working with dummy data", async () => {
            const category = {
                _id: "5d46ec020d9cba13cc66c5b6",
                click: 4
            };
            await categories.update(category);
        });
    });

    describe("mapping", () => {
        it("should working well", () => {
            const category = {
                id: "ca-bien"
            };
            const expected = {
                url: "ca-bien"
            };
            categories.mapping(category);
        });
    });
});