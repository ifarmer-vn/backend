const request = require("request");
const {createTasks, executeTasks} = require("../../utils");
const media = require("../../image/media");
const contentName = "categories";
const contentType = require("../_base/content-type");
const update = contentType.update(contentName);
const getAll = contentType.getAll(contentName);
const deleteAll = contentType.deleteAll(contentName);

const updateImage = media.upload("categories", "images");

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
    return new Promise(async (resolve, reject) => {
        const mapped = mapping(category);
        const image = await media.downloadImageFromFireBase(category.image);
        request.post({
            url: "http://localhost:1337/categories",
        }, async function callback(error, response, body) {
            var info = JSON.parse(body);
            const output = await updateImage(info._id, image);
            resolve(output, info);
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
        keywords: [],
        disable: category.hide,
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
