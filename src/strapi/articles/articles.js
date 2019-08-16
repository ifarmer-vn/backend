const request = require("request");
const fs = require("fs");
const media = require("../media");
const contentName = "articles";
const contentType = require("../_base/content-type");
const update = contentType.update(contentName);

const updateArticleImage = media.upload("articles", "images");
const createAll = articles => {
    return new Promise(async (resolve, reject) => {
        for (const pp in articles) {
            const category = articles[pp];
            const res = await create(category);
            console.log(res);
        }
        resolve();
    });
};
const create = article => {
    return new Promise(async (resolve, reject) => {
        const mapped = mapping(article);
        const image = await media.downloadImageFromFireBase(article.image);
        request.post({
            url: `http://localhost:1337/${contentName}`,
        }, async function callback(error, response, body) {
            var info = JSON.parse(body);
            console.log(info);
            const output = await updateArticleImage(info._id, image, "articles/" + article.id);
            resolve(output, info);
        }).form(mapped);
    });
};


const mapping = article => {
    return {
        url: article.id,
        name: article.name,
        author: article.author,
        category: article.category,
        content: article.content,
        createdAt: article.dateCreated,
        updatedAt: article.dateModified,
        title: article.title,
        description: article.shortDescription,
        disable: article.hide
    };
};

const revealed = {
    create,
    mapping,
    createAll,
    update
};
module.exports = revealed;
