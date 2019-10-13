const transformData = require("./transformData");
describe("transformData", () => {
    describe("imgToAmpImg", () => {
        it("should return correct data", async () => {
            let content = `<img src="test" />`;
            let expected = [
                {
                    origin: content,
                    replace: `<amp-img src="test" width="1600" height="900" layout="responsive"></amp-img>`
                }
            ];

            expect(expected).toEqual(transformData.imgToAmpImg(content));
        });
    });
    describe("convertToAmp", () => {

        fit("should return correct data", async () => {
            let content = `<img src="test" >`;
            let expected = `<amp-img src="test" width="1600" height="900" layout="responsive"></amp-img>`;
            console.log(transformData.convertToAmp(content));
            expect(expected).toBe(transformData.convertToAmp(content));

        });
    });
});
