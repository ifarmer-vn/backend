const media = require("./media");
const fs = require("fs");
describe("media", () => {
    describe("upload", () => {
        fit("should return correct data", async () => {

            let path = __dirname + "/test.png";
            let file = fs.createReadStream(path);

            // file.name = "test.png";
            // file.mine = "image/png";
            const body = {
                "files": {
                    files: file
                }, // Buffer or stream of file(s)
                fields: {
                    "refId": "5d4317959c888723682632c8", // User's Id.
                    "path": "", // Uploading folder of file(s).
                    "ref": "categories", // Model name.
                    // "source": "content-manager", // Plugin name.
                    "field": "images" // Field name in the User model.

                }
            };
            const output = await media.upload(body);
            expect({}).toEqual(output);
        });
    });
});