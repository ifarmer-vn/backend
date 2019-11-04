const cmsVariants = require("../strapi/variants/variants");
const esVariants = require("../elk/elasticsearch/indices/variants/index");
const variantIndex = require("../elk/elasticsearch/indices/variants/index");
const media = require("../image/media");
const utils = require("../utils");
const imagemin = require('imagemin');
const imageminWebp = require('imagemin-webp');
const uploadImage = require("../firebase/upload-image");
const getAllVariantsInCMS = async () => {
    let variants = await cmsVariants.getAll();
    let result = {};
    variants.map((item) => {
        result[item["url"]] = item;
    });
    return result;
};

const getAllVariantsInES = async () => {
    const variants = await esVariants.getAll();
    let result = {};
    variants.map((item) => {
        result[item['_source']["url"]] = item;
    });
    return result;
};

const checkDataNeedProcessImages = (cmsData, esData) => {
    let result = [];
    for (let pp in esData) {
        if (esData[pp]['_source']['images']) {
            const transformedImages = esData[pp]._source.transformedImages;
            const images = esData[pp]._source.images;
            if (transformedImages) {
                for (let i = 0; i < images.length; i++) {
                    let transformedImage = transformedImages[i];
                    if (!transformedImage) {
                        result.push(esData[pp]);
                        return result;
                    } else {
                        if (transformedImage.hash !== images[i].hash) {
                            result.push(esData[pp]);
                            return result;
                        }
                    }
                }
            } else {
                result.push(esData[pp]);
                return result;
            }
        } else {
            console.log("missing images", pp);
        }
    }
    return result;
};
const main = async () => {
    const cmsVariantsData = await getAllVariantsInCMS();
    const esVariantsData = await getAllVariantsInES();
    let variants = checkDataNeedProcessImages(cmsVariantsData, esVariantsData);
    console.log('Data need transform', variants.length);
    await transform(variants);
};

const transform = async (arr) => {
    const timestamp = +new Date();
    const tempFolder = `temp/transform-images/tmp_${timestamp}`;
    const croppedFolder = `temp/transform-images/cropped_${timestamp}`;
    const processedFolder = `temp/transform-images/processed_${timestamp}`;
    utils.createDir("temp/transform-images");
    utils.createDir(croppedFolder);
    utils.createDir(processedFolder);
    utils.createDir(tempFolder);
    let updatedVariants = [];
    for (let i = 0; i < arr.length; i++) {
        let item = arr[i];
        const images = item._source.images;
        item._source.transformedImages = item._source.transformedImages ? item._source.transformedImages : [];
        for (let j = 0; j < images.length; j++) {
            let image = images[j];
            if (!item._source.transformedImages[j]) {
                const transformedImage = await processImage(image);
                item._source.transformedImages.push({
                    image: transformedImage,
                    hash: image.hash
                })
            } else {
                if (item._source.transformedImages[j].hash !== image.hash) {
                    const transformedImage = await processImage(image);
                    item._source.transformedImages[j] = {
                        image: transformedImage,
                        hash: image.hash
                    }
                }
            }
        }
        updatedVariants.push(
            {
                _id: item._id,
                transformedImages: item._source.transformedImages,
            }
        )
    }
    variantIndex.updateBulk(updatedVariants);

    async function processImage(image) {
        const imageURL = image.url;
        const fileName = getFileName(imageURL);
        const dataTempFolder = `${tempFolder}/${image.hash}`;
        const dataCroppedFolder = `${croppedFolder}/${image.hash}`;
        const dataProcessedFolder = `${processedFolder}/${image.hash}`;
        utils.createDir(dataTempFolder);
        utils.createDir(dataCroppedFolder);
        utils.createDir(dataProcessedFolder);
        await media.download(imageURL, `${dataTempFolder}/${fileName}`);
        await cropImage(`${dataTempFolder}/${fileName}`, dataCroppedFolder);
        const transformedImages = await transformImage(dataCroppedFolder, dataProcessedFolder);
        return await uploadImages(transformedImages, image.hash);
    }
};

const uploadImages = async (images, hash) => {
    let result = {};
    for (let i = 0; i < images.length; i++) {
        const image = images[i];
        const fileName = getFileName(image);
        const destination = `a/${hash}/${fileName}`;
        const url = await uploadImage.upload(image, destination);
        const sizeName = getTypeSize(url);
        result[sizeName] = url;
    }
    return result;
};
const getTypeSize = (url) => {
    if (url.includes("s_1920x1080__"))
        return "large_16x9";
    if (url.includes("s_1080x1080__"))
        return "large_1x1";
    if (url.includes("s_1280x720__"))
        return "medium_16x9";
    if (url.includes("s_540x540__"))
        return "medium_1x1";
    if (url.includes("s_320x180__"))
        return "small_16x9";
    if (url.includes("s_200x200__"))
        return "small_1x1";
    if (url.includes("s_40x40__"))
        return "icon";
};
const cropImage = async (filePath, desFolder) => {
    const dimensions = [
        [1920, 1080], //large
        [1080, 1080],
        [1280, 720], //medium
        [540, 540],
        [320, 180], //small
        [200, 200],
        [40, 40], //icon
    ];
    const fileName = getFileName(filePath);
    for (let i = 0; i < dimensions.length; i++) {
        const dimension = dimensions[i];
        const desFile = `s_${dimension[0]}x${dimension[1]}__${fileName}`;
        await media.crop(filePath, `${desFolder}/${desFile}`, dimension[0], dimension[1]);
    }
};
const getFileName = url => {
    const urlSet = url.split('/');
    return urlSet[urlSet.length - 1];
};
const transformImage = (targetFolder, desFolder) => {
    return imagemin([`${targetFolder}/*.*`], {
        destination: desFolder,
        plugins: [
            imageminWebp({})
        ]
    }).then((res) => {

        console.log('Images optimized', res.length);
        return getSingleArr(res, 'destinationPath');
    });
};
const getSingleArr = (arr, propertyName) => {
    let result = [];

    arr.map(item => {
        result.push(item[propertyName]);
    });
    return result;
};
console.time('Start Enrich images');
main().then(() => {
    console.timeEnd('Start Enrich images');
});
