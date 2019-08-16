const data = require("../../temp/data");

const convert = require("./convert");
describe("convert", () => {
    describe("parse", () => {
        it("should return correct data", async () => {
            const content = data.articles[70].content;
            const output = await convert.parse(content);
            console.log(output);
        });
    });
    describe("ampToNoneAmp", () => {
        fit("should return correct data", async () => {
            const content = data.articles[70].content;
            const output = await convert.ampToNoneAmp(content);
            console.log(output);
        });
    });
});