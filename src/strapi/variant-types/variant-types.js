const request = require("request");
const fs = require("fs");
const contentName = "varianttypes";
const contentType = require("../_base/content-type");
const update = contentType.update(contentName);
const getAll = contentType.getAll(contentName);

const createAll = variantTypes => {
    return new Promise(async (resolve, reject) => {
        for (const pp in variantTypes) {
            const variantType = variantTypes[pp];
            const res = await create(variantType);
            console.log(res);
        }
        resolve();
    });
};
const create = variantType => {
    return new Promise((resolve, reject) => {
        const mapped = mapping(variantType);
        request.post({
            url: `http://localhost:1337/${contentName}`,
        }, async function callback(error, response, body) {
            const info = JSON.parse(body);
            console.log(info);
            resolve(info);
        }).form(mapped);
    });
};


const mapping = variantType => {
    return {
        url: variantType.id,
        name: variantType.name,
        order: variantType.order,
        children: variantType.children
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
