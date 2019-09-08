const {createTasks, executeTasks} = require("../utils");
const contentTypes = [
    require("./article-categories/article-categories"),
    require("./articles/articles"),
    require("./categories/categories"),
    require("./products/products"),
    require("./variant-types/variant-types"),
    require("./variants/variants"),
];
const deleteData = [
    require("./article-categories/article-categories"),
    require("./articles/articles"),
    require("./categories/categories"),
    require("./products/products"),
    require("./variant-types/variant-types"),
    require("./variants/variants"),
    require("./upload/upload"),
];
const migrateAll = [
    require("./categories/migrate"),
    require("./articles/migrate"),
    require("./article-categories/migrate"),
    require("./products/migrate"),
    require("./variant-types/migrate"),
    require("./variants/migrate"),
];

const getDataByContentTypes = contentTypes => {
    return new Promise(async resolve => {
        const promises = [];
        const results = {};
        contentTypes.map(contentType => {
            promises.push(contentType.getAll().then(data => {
                results[contentType.getName()] = data;
            }));
        });
        Promise.all(promises).then(() => {
            resolve(results);
        });
    });
};
const getAllData = () => {
    return getDataByContentTypes(contentTypes);
};
const deleteAllData = () => {
    return new Promise(async resolve => {
        const promises = [];
        deleteData.map(contentType => {
            promises.push(contentType.deleteAll().then(data => {
            }));
        });
        Promise.all(promises).then(() => {
            resolve();
        });
    });
};

const migrateFirebase = async () => {
    let migrateFirebaseTasks = [];
    const migrateSingleTask = createTasks(migrateFirebaseTasks);
    migrateAll.map(contentType => migrateSingleTask(async () => {
        await contentType.migrate();
    }));
    await executeTasks(migrateFirebaseTasks, {thread: 1});
};

module.exports = {
    getAllData,
    deleteAllData,
    migrateFirebase,
    getDataByContentTypes
};
