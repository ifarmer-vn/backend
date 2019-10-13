const convert = require("./convert");
const {createTasks, executeTasks} = require("../utils");
const {getDataByContentTypes} = require("../strapi/strapi");

const updateRow = (row, model) => {
    return model.update(row);
};
const updateData = async (data, model) => {
    let needUpdatedData = [];
    console.log("updateData", model.getName(), data.length);
    let covertTasks = [];
    const addConvertTask = createTasks(covertTasks);
    data.map(async items => addConvertTask(async () => {
        const newContent = await convert.ampToNoneAmp(items.content);
        needUpdatedData.push({
            _id: items._id,
            content: newContent
        });
    }));
    await executeTasks(covertTasks, {});

    let updateTasks = [];
    const addUpdateTask = createTasks(updateTasks);
    needUpdatedData.map(item => addUpdateTask(async () => {
        await updateRow(item, model);
    }));
    await executeTasks(updateTasks, {});
};

async function main() {
    const contentTypes = [
        require("../strapi/articles/articles"),
        require("../strapi/products/products"),
    ];
    const data = await getDataByContentTypes(contentTypes);

    await updateData(data.articles, require("../strapi/articles/articles"));
    await updateData(data.products, require("../strapi/products/products"));
}

console.time("amp convert");
main().then(() => {
    console.timeEnd("amp convert");
});

