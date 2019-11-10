const {getAllData, restoreData} = require('../../mongodb/index');

const getAllDataFromMongoDB = async () => {
    const data = await getAllData();
    await restoreData(data);
    return [];
};

const main = async () => {
    await getAllDataFromMongoDB();
};

console.time('Restore QA DB');
main().then(() => {
    console.timeEnd('Restore QA DB');
});

