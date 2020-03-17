const cmsVariants = require("../strapi/variants/variants");
const cmsArticles = require("../strapi/articles/articles");
const cmsCategories = require("../strapi/categories/categories");
const media = require("../image/media");
const utils = require("../utils");
const {createTasks, executeTasks} = require("../utils");
const imagemin = require('imagemin');
const imageminWebp = require('imagemin-webp');
const uploadImage = require("../firebase/upload-image");

const getDataInCMS = async (cmsCollection) => {
    let data = await cmsCollection.getAll();
    let result = {};
    data.map((item) => {
        result[item["url"]] = item;
    });
    return result;
};
const checkDataNeedProcessImages = (cmsData) => {
    let result = [];
    for (let pp in cmsData) {
        if (cmsData[pp].images && cmsData[pp].images.length) {
            const transformedImages = cmsData[pp].transformedImages;
            const images = cmsData[pp].images;
            if (transformedImages) {
                for (let i = 0; i < images.length; i++) {
                    let transformedImage = transformedImages[i];
                    if (!transformedImage) {
                        result.push(cmsData[pp]);
                    } else {
                        if (transformedImage.hash !== images[i].hash) {
                            result.push(cmsData[pp]);
                        }
                    }
                }
            } else {
                result.push(cmsData[pp]);
            }
        } else {
            console.log("missing images", pp);
        }
    }
    return result;
};
const main = async () => {
    const cmsVariantsData = await getDataInCMS(cmsVariants);
    const cmsArticlesData = await getDataInCMS(cmsArticles);
    const cmsCategoriesData = await getDataInCMS(cmsCategories);
    let variants = checkDataNeedProcessImages(cmsVariantsData);
    let articles = checkDataNeedProcessImages(cmsArticlesData);
    let categories = checkDataNeedProcessImages(cmsCategoriesData);
    console.log('Data need transform', variants.length);
    await transform(articles, cmsArticles);
    await transform(categories, cmsCategories);
    await transform(variants, cmsVariants);
};
const deleteImages = async (images) => {
    if (!images) {
        return;
    }
    let promises = [];
    for (let i = 0; i < images.length; i++) {
        const transformedImages = images[i].image;
        for (let pp in transformedImages) {
            promises.push(deleteImage(transformedImages[pp].name));
        }
    }
    await Promise.all(promises);
};
const deleteImage = async (imgName) => {
    return uploadImage.remove(imgName);
};

const transformData = async (data, cmsCollection, tempFolder, croppedFolder, processedFolder) => {
    const images = data.images;
    if (data.transformedImages) {
        console.log("Delete images", data._id);
    }
    await deleteImages(data.transformedImages);
    let transformedImages = [];
    for (let j = 0; j < images.length; j++) {
        let image = images[j];
        const transformedImage = await processImage(image, tempFolder, croppedFolder, processedFolder);
        transformedImages.push({
            image: transformedImage,
            hash: image.hash
        })
    }
    return await cmsCollection.update({
        _id: data._id,
        transformedImages: transformedImages,
    });
};
const processImage = async (image, tempFolder, croppedFolder, processedFolder) => {
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
};

const transform = async (arr, cmsCollection) => {
    const timestamp = +new Date();
    const tempFolder = `temp/transform-images/tmp_${timestamp}`;
    const croppedFolder = `temp/transform-images/cropped_${timestamp}`;
    const processedFolder = `temp/transform-images/processed_${timestamp}`;
    utils.createDir("temp/transform-images");
    utils.createDir(croppedFolder);
    utils.createDir(processedFolder);
    utils.createDir(tempFolder);

    let updateTasks = [];
    const addUpdateTask = createTasks(updateTasks);
    arr.map(item => addUpdateTask(async () => {
        await transformData(item, cmsCollection, tempFolder, croppedFolder, processedFolder)
    }));
    await executeTasks(updateTasks, {});
};

const uploadImages = async (images, hash) => {
    let result = {};
    for (let i = 0; i < images.length; i++) {
        const image = images[i];
        const fileName = getFileName(image);
        const destination = `a/${hash}/${fileName}`;
        const uploadedImg = await uploadImage.upload(image, destination);
        const sizeName = getTypeSize(uploadedImg.url);
        result[sizeName] = uploadedImg;
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
