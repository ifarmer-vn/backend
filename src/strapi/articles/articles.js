const request = require("request");
const media = require("../../image/media");
const {createTasks, executeTasks} = require("../../utils");
const contentName = "articles";
const contentType = require("../_base/content-type");
const update = contentType.update(contentName);
const getAll = contentType.getAll(contentName);
const deleteAll = contentType.deleteAll(contentName);

const updateArticleImage = media.upload("articles", "images");

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

const create = article => {
    return new Promise(async (resolve, reject) => {
        const mapped = mapping(article);
        const image = await media.downloadImageFromFireBase(article.image);
        request.post({
            url: `http://localhost:1337/${contentName}`,
        }, async function callback(error, response, body) {
            var info = JSON.parse(body);
            const output = await updateArticleImage(info._id, image);
            resolve(output, info);
        }).form(mapped);
    });
};
const createArticle = article =>{
    return new Promise(async (resolve, reject) => {
        request.post({
            url: `http://localhost:1337/${contentName}`,
        }, async function callback(error, response, body) {
            var info = JSON.parse(body);
            const output = await updateArticleImage(info._id, article.image);
            console.log(info.url)
            resolve(output, info);
        }).form(article);
    });
};

const mapping = article => {
    return {
        url: article.id,
        name: article.name,
        author: article.author,
        article_category: article.category,
        content: article.content,
        createdAt: article.dateCreated,
        updatedAt: article.dateModified,
        title: article.title,
        description: article.shortDescription,
        related_products: article.product? [article.product]: [],
        propagated_urls: [],
        keywords: [],
        disable: article.hide,
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
    createArticle,
    update
};
module.exports = revealed;
