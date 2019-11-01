const request = require("request");
const {createTasks, executeTasks} = require("../../utils");
const media = require("../../image/media");
const contentName = "variants";
const contentType = require("../_base/content-type");
const update = contentType.update(contentName);
const getAll = contentType.getAll(contentName);
const deleteAll = contentType.deleteAll(contentName);

const updateImage = media.upload("variants", "images");

const createAll = async data => {
    let tasks = [];
    const singleTask = createTasks(tasks);
    for (const pp in data) {
        let item = data[pp];
        item.id = pp;
        singleTask(async () => await create(item));
    }
    await executeTasks(tasks, {thread: 10});
};

const create = variant => {
    return new Promise(async (resolve, reject) => {
        const mapped = mapping(variant);
        const images = await downloadImages(variant.images);
        request.post({
            url: `http://localhost:1337/${contentName}`,
        }, async function callback(error, response, body) {
            var info = JSON.parse(body);
            let tasks = [];
            const singleTask = createTasks(tasks);
            images.map(async image => singleTask(async () => {
                await updateImage(info._id, image);
            }));
            await executeTasks(tasks, {thread: 1});
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
            if (url.includes("/assets/img/")) {
                resolve("/home/haibui/projects/ifarmer/backend/src/data-examples" + url);
                return;
            } else {
                url = url.replace(/\//g, '%2F');
                url = `https://firebasestorage.googleapis.com/v0/b/ifarmer-e25f1.appspot.com/o/${url}?alt=media&token=6008e893-c74b-4bf0-be37-c1de0495202e`;
            }
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
        keywords: [],
        variantTypes: variant.variantTypes
    };
};

const getName = () => {
    return contentName;
};

const revealed = {
    getName,
    getAll,
    deleteAll,
    create,
    mapping,
    createAll,
    downloadImage: downloadImage,
    update
};
module.exports = revealed;
