const request = require("request");
const {createTasks, executeTasks} = require("../../utils");
const contentName = "products";
const contentType = require("../_base/content-type");
const update = contentType.update(contentName);
const getAll = contentType.getAll(contentName);
const deleteAll = contentType.deleteAll(contentName);

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

const create = product => {
    return new Promise(async (resolve, reject) => {
        const mapped = mapping(product);
        request.post({
            url: `http://localhost:1337/${contentName}`,
        }, async function callback(error, response, body) {
            var info = JSON.parse(body);
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
    deleteAll,
    create,
    mapping,
    createAll,
    update
};
module.exports = revealed;
