const request = require("request");
const fs = require("fs");
const media = require("../media");
const contentName = "variants";
const contentType = require("../_base/content-type");
const update = contentType.update(contentName);

const updateArticleImage = media.upload("variants", "images");
const createAll = variants => {
    return new Promise(async (resolve, reject) => {
        let tasks = [];
        let blockTemp = [];
        let i = 1;
        for (const pp in variants) {

            const variant = variants[pp];
            blockTemp.push(async () => {
                await create(variant);
            });
            if (i % 10 === 0) {
                tasks.push(blockTemp);
                blockTemp = [];
            }
            i++;
        }
        if (blockTemp.length > 0) {
            tasks.push(blockTemp);
        }
        for (let i = 0; i < tasks.length; i++) {
            await executeAsync(tasks[i])
        }

        resolve();
    });
};
const executeAsync = tasks => {
    const timeStart = "timeStart-" + (+new Date());
    console.time(timeStart);
    return new Promise(resolve => {
        let promises = [];
        tasks.map(task => {
            promises.push(task());
        });
        Promise.all(promises).then(() => {
            console.timeEnd(timeStart);
            resolve();
        });
    });
};
const create = variant => {
    return new Promise(async (resolve, reject) => {
        const mapped = mapping(variant);
        const images = await downloadImages(variant.images);
        request.post({
            url: `http://localhost:1337/${contentName}`,
        }, async function callback(error, response, body) {
            var info = JSON.parse(body);
            images.map(async image => {
                await updateArticleImage(info._id, image);
            });
            resolve(info);
        }).form(mapped);
    });
};
const downloadImages = (urls) => {
    let promises = [];
    let images = [];
    return new Promise(async resolve => {
        urls.map(url => {
            promises.push(downloadImage(url).then(fileName => {
                images.push(fileName);
            }));
        });

        Promise.all(promises).then(() => {
            resolve(images);
        });
    });
};
const downloadImage = async url => {
    return new Promise(async resolve => {
        if (!url.includes("https://")) {
            // console.log("not in firebase", url);
            resolve("/home/haibui/projects/ifarmer/backend/src/data-examples/ifarmer-image/" + url);
            return;
        }
        const path = url.split("?")[0].split("%2F");
        const fileName = "/home/haibui/projects/ifarmer/backend/src/data-examples/tmp/" + path[path.length - 1];
        await media.download(url, fileName);
        resolve(fileName);
    });

};


const mapping = variant => {
    return {
        url: variant.id,
        name: variant.name,
        author: variant.author,
        default: variant.defaultProduct,
        extraTitle: variant.extraTittle,
        price: variant.price,
        product: variant.product,
        createdAt: variant.dateCreated,
        updatedAt: variant.dateModified,
        title: variant.title,
        description: variant.shortDescription,
        disable: variant.hide,
        variantTypes: variant.variantTypes
    };
};

const revealed = {
    create,
    mapping,
    createAll,
    downloadImage,
    update
};
module.exports = revealed;
