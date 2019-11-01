const media = require("./media");
const fs = require("fs");
describe("media", () => {
    describe("upload", () => {
        it("should return correct data", async () => {

            const output = await media.upload();
        });
    });
    describe("download", () => {
        it("should return correct data", async () => {
            const url ="https://firebasestorage.googleapis.com/v0/b/ifarmer-e25f1.appspot.com/o/articles%2Ftrai-cay%2F40-kieu-trang-tri-trai-cay-ngo-nghinh%2Fca-heo-chuoi-nho.jpg?alt=media&token=4eac391e-c45d-4d92-83be-9a9820fcff18";
            const des = "/home/haibui/projects/ifarmer/backend/src/data-examples/tmp/test.jpg";
            await media.download(url,des);
        });
    });
    describe("downloadImageFromFireBase", () => {
        it("should working well", async () => {
            const url = "https://firebasestorage.googleapis.com/v0/b/ifarmer-e25f1.appspot.com/o/articles%2Ftrai-cay%2F40-kieu-trang-tri-trai-cay-ngo-nghinh%2Fca-heo-chuoi-nho.jpg?alt=media&token=4eac391e-c45d-4d92-83be-9a9820fcff18";
            await media.downloadImageFromFireBase(url);
        });
    });
});