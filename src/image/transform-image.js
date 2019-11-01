const media = require("./media");
const utils = require("../utils");
const imagemin = require('imagemin');
const imageminWebp = require('imagemin-webp');

const main = async () => {
    const timestamp = +new Date();
    const tempFolder = `temp/transform-images/tmp_${timestamp}`;
    const croppedFolder = `temp/transform-images/cropped_${timestamp}`;
    const processedFolder = `temp/transform-images/processed_${timestamp}`;
    utils.createDir("temp/transform-images");
    utils.createDir(croppedFolder);
    utils.createDir(processedFolder);
    utils.createDir(tempFolder);
    const urlImage = "https://storage.googleapis.com/ifarmer-vn/d35eec220668479fa6fe742c5b81a864/bach-thuoc.jpg";
    await media.download(urlImage, `${tempFolder}/bach-thuoc.jpg`);
    await media.crop(`${tempFolder}/bach-thuoc.jpg`, `${croppedFolder}/bach-thuoc.jpg`, 500, 500);
    await transformImage(croppedFolder, processedFolder);
};
const transformImage = (targetFolder, desFolder) => {
    return imagemin([`${targetFolder}/*.*`], {
        destination: desFolder,
        plugins: [
            imageminWebp({})
        ]
    }).then((res) => {
        console.log('Images optimized', res.length);
    });
};

console.time('Start transform image');
main().then(() => {
    console.timeEnd('Start transform image');
});