const articles = require("./articles");
const data = require("../../data-examples/ifarmer").articles;

describe("articles", () => {
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
            articles.createAll(cats);
        });
        it("should working with json data", async () => {
            await articles.createAll(data);
        });
    });
    describe("create", () => {
        it("should working with dummy data", async () => {
            const article = {
                url1: "ca-bien1"
            };
            await articles.create(article);
        });
        it("should working with json data", async () => {
            const article = data["bach-thuoc-loi-tieu-chua-dau-bung-kinh-nguyet-khong-deu-mo-hoi-trom"];
            await articles.create(article);
        });
    });

    describe("mapping", () => {
        it("should working well", () => {
            const article = {
                id: "ca-bien"
            };
            const expected = {
                url: "ca-bien"
            };
            articles.mapping(article);
        });
    });
    describe("downloadImage", () => {
        it("should working well", async () => {
            const url = "https://firebasestorage.googleapis.com/v0/b/ifarmer-e25f1.appspot.com/o/articles%2Ftrai-cay%2F40-kieu-trang-tri-trai-cay-ngo-nghinh%2Fca-heo-chuoi-nho.jpg?alt=media&token=4eac391e-c45d-4d92-83be-9a9820fcff18";
            await articles.downloadImage(url);
        });
    });
});