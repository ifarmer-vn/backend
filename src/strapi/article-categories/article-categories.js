const request = require("request");
const {createTasks, executeTasks} = require("../../utils");
const contentName = "articlecategories";
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
const create = category => {
    return new Promise((resolve, reject) => {
        const mapped = mapping(category);
        const image = "";
        request.post({
            url: `http://localhost:1337/${contentName}`,
        }, async function callback(error, response, body) {
            var info = JSON.parse(body);
            resolve(info);
        }).form(mapped);
    });
};


const mapping = articleCategories => {
    return {
        url: articleCategories.id,
        name: articleCategories.name,
        createdAt: articleCategories.dateCreated,
        updatedAt: articleCategories.dateModified,
        title: articleCategories.title,
        description: articleCategories.shortDescription,
        popularity: articleCategories.popularity,
        disable: articleCategories.hide
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
