const products = require("./products");
const data = require("../../data-examples/ifarmer").products;

describe("products", () => {
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
            products.createAll(cats);
        });
        it("should working with json data", async () => {
            await products.createAll(data);
        });
    });
    describe("create", () => {
        it("should working with dummy data", async () => {
            const product = {
                url1: "ca-bien1"
            };
            await products.create(product);
        });
        it("should working with json data", async () => {
            const product = data["banh-thung"];
            await products.create(product);
        });
    });

    describe("mapping", () => {
        it("should working well", () => {
            const product = {
                id: "ca-bien"
            };
            const expected = {
                url: "ca-bien"
            };
            products.mapping(product);
        });
    });

});