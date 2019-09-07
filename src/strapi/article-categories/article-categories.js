const request = require("request");
const fs = require("fs");
const contentName = "articlecategories";
const contentType = require("../_base/content-type");
const update = contentType.update(contentName);
const getAll = contentType.getAll(contentName);

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
        const image = "";
        request.post({
            url: `http://localhost:1337/${contentName}`,
        }, async function callback(error, response, body) {
            var info = JSON.parse(body);
            console.log(info);
            resolve(info);
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

const getName = () => {
    return contentName;
};

const revealed = {
    getName,
    getAll,
    create,
    mapping,
    createAll,
    update
};
module.exports = revealed;
