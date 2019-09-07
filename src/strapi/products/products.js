const request = require("request");

const contentName = "products";
const contentType = require("../_base/content-type");
const update = contentType.update(contentName);
const getAll = contentType.getAll(contentName);

const createAll = products => {
    return new Promise(async (resolve, reject) => {
        for (const pp in products) {
            let product = products[pp];
            product.id = pp;
            const res = await create(product);
            console.log(res);
        }
        resolve();
    });
};

const create = product => {
    return new Promise(async (resolve, reject) => {
        const mapped = mapping(product);
        request.post({
            url: `http://localhost:1337/${contentName}`,
        }, async function callback(error, response, body) {
            var info = JSON.parse(body);
            console.log(info);
            resolve(info);
        }).form(mapped);
    });
};

const mapping = product => {
    return {
        url: product.id,
        name: product.name,
        category: product.category,
        content: product.content,
        createdAt: product.dateCreated,
        updatedAt: product.dateModified,
        title: product.title,
        price: product.price,
        disable: product.hide
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
