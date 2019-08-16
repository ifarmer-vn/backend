const CMSData = require("../../temp/data");
const convert = require("./convert");
const createTasks = tasks => task => {
    tasks.push(task);
};
const executeTasks = async (tasks, opt) => {
    const thread = opt.thread || 10;
    let currentTasks = tasks.splice(0, thread);
    while (currentTasks.length) {
        await executeAsync(currentTasks)
        currentTasks = tasks.splice(0, thread);
    }
};

const executeAsync = tasks => {
    const timeStart = "timeStart-" + (+new Date());
    console.time(timeStart);
    return new Promise(resolve => {
        let promises = [];
        tasks.map(task => {
            promises.push(task());
        });
        Promise.all(promises).then(() => {
            console.timeEnd(timeStart);
            resolve();
        });
    });
};
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
