const request = require("request");

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
            url: "http://localhost:1337/products",
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

const revealed = {
    create,
    mapping,
    createAll
};
module.exports = revealed;
