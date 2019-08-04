const request = require("request");
const fs = require("fs");
const media = require("../media");

const updateCategoryImage = media.upload("categories", "images");
const createAll = categories => {
    return new Promise(async (resolve, reject) => {
        for (const pp in categories) {
            const category = categories[pp];
            const res = await create(category);
            console.log(res);
        }
        resolve();
    });
};
const create = category => {
    return new Promise((resolve, reject) => {
        const mapped = mapping(category);
        const imageName = category.image.split("?")[0].replace("https://firebasestorage.googleapis.com/v0/b/ifarmer-e25f1.appspot.com/o/category%2F", "");
        const image = "/home/haibui/projects/ifarmer/backend/src/data-examples/ifarmer-image/categories/" + imageName;
        request.post({
            url: "http://localhost:1337/categories",
        }, async function callback(error, response, body) {
            var info = JSON.parse(body);
            console.log(info);
            const output = await updateCategoryImage(info._id, image, "categories/" + category.id);
            resolve(output, info);
        }).form(mapped);
    });
};


const mapping = category => {
    return {
        url: category.id,
        name: category.name,
        createdAt: category.dateCreated,
        updatedAt: category.dateModified,
        title: category.title,
        description: category.shortDescription,
        popularity: category.popularity,
        disable: category.hide
    };
};

const revealed = {
    create,
    mapping,
    createAll
};
module.exports = revealed;
