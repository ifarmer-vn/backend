const {getAllData, restoreData} = require('../../mongodb');

const getAllDataFromMongoDB = async () => {
    return getAllData();
};

const main = async () => {
    const data = await getAllDataFromMongoDB();
    await restoreData(data);
};

console.time('Restore QA DB');
main().then(() => {
    console.timeEnd('Restore QA DB');
});

