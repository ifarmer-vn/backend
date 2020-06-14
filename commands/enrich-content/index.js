const cmsArticles = require("../../src/strapi/articles/articles");
const utils = require("../../src/utils");
let count = 0;

const main = async () => {
    let articlesCMS = await cmsArticles.getAll();
    let articlesNeedToUpdate = [];
    articlesCMS.map(article => {
        console.log("url", article.url);
        const keywords = utils.objToArray(article.keywords);
        let content = article.content;
        if (keywords && keywords.length) {
            console.log("length", keywords.length);
            keywords.map(keyword => {
                if (content.includes(keyword[0])) {
                    count++;
                    console.log(keyword[0]);
                    content = content.replace(keyword[0], `<b>${keyword[0]}</b>`);
                    articlesNeedToUpdate.push({
                        _id: article._id,
                        content: content
                    });
                }
            });
        }
    });
    await updateArticlesCMS(articlesNeedToUpdate);
};

const updateArticlesCMS = async (articles) => {
    let tasks = [];
    const insertTask = utils.createTasks(tasks);
    articles.map(article => insertTask(async () => {
        await cmsArticles.update(article);
    }));
    return await utils.executeTasks(tasks, {});
};
console.time("enrich-content");
main().then(() => {
    console.log("keywords", count)
    console.timeEnd("enrich-content");
});
