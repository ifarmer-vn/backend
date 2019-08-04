const request = require("request");
const fs = require("fs");

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
            url: "http://localhost:1337/articlecategories",
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

const revealed = {
    create,
    mapping,
    createAll
};
module.exports = revealed;
