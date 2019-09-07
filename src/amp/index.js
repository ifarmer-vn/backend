const CMSData = require("../../temp/data");
const convert = require("./convert");
const {createTasks, executeTasks} = require("../utils");

const updateData = (row) => {
    const articlesModel = require("../strapi/articles/articles");
    return articlesModel.update(row);
};

main();

async function main() {
    const articles = CMSData.articles;
    let needUpdatedData = [];
    let covertTasks = [];
    const addConvertTask = createTasks(covertTasks);
    articles.map(async article => addConvertTask(async () => {
        const newContent = await convert.ampToNoneAmp(article.content);
        needUpdatedData.push({
            _id: article._id,
            content: newContent
        });
    }));
    await executeTasks(covertTasks, {});

    let updateTasks = [];
    const addUpdateTask = createTasks(updateTasks);
    needUpdatedData.map(item => addUpdateTask(async () => {
        await updateData(item);
    }));
    await executeTasks(updateTasks, {});
}
