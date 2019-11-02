const uploadImage = require("./upload-image");
const main = async () => {
    uploadImage.upload(__dirname + "/temp/bach-thuoc.webp", "0000_test/bach-thuoc.webp");
};

console.time('Start upload image');
main().then(() => {
    console.timeEnd('Start upload image');
});