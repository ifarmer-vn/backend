const request = require("request");
const fs = require("fs");
const media = require("../media");

const updateArticleImage = media.upload("variants", "images");
const createAll = variants => {
    return new Promise(async (resolve, reject) => {
        let temp = []
        for (const pp in variants) {

            const variant = variants[pp];
            temp.push(variant);
        }
        for(let i =0; i<temp.length;i++){
            const variant = temp[i];
            const res = await create(variant);
            console.log(res);
        }

        resolve();
    });
};
const create = variant => {
    return new Promise(async (resolve, reject) => {
        const mapped = mapping(variant);
        const images = await downloadImages(variant.images);
        request.post({
            url: "http://localhost:1337/variants",
        }, async function callback(error, response, body) {
            var info = JSON.parse(body);
            images.map(image => {
                await updateArticleImage(info._id, image, "variants/" + variant.id);
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
            console.log("not in firebase", url);
            resolve("/home/haibui/projects/ifarmer/backend/src/data-examples" + url);
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
        extraTittle: variant.extraTittle,
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
    downloadImage
};
module.exports = revealed;
