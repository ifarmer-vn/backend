const request = require("request");
const {createTasks, executeTasks} = require("../../utils");
const contentName = "varianttypes";
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

const create = variantType => {
    return new Promise((resolve, reject) => {
        const mapped = mapping(variantType);
        request.post({
            url: `http://localhost:1337/${contentName}`,
        }, async function callback(error, response, body) {
            const info = JSON.parse(body);
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
    deleteAll,
    create,
    mapping,
    createAll,
    update
};
module.exports = revealed;
