const request = require("request");
const fs = require("fs");

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
            url: "http://localhost:1337/varianttypes",
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

const revealed = {
    create,
    mapping,
    createAll
};
module.exports = revealed;
