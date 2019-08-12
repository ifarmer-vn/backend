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
        const image = await downloadImage(article.image);
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
    downloadImage,
    update
};
module.exports = revealed;
