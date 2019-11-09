const {getAllData} = require('../../mongodb/index');

const getAllDataFromMongoDB = async () => {
    const data = await getAllData();
    console.log(data);
    return data;
};

const main = async () => {
    await getAllDataFromMongoDB();
};

console.time('Restore QA DB');
main().then(() => {
    console.timeEnd('Restore QA DB');
});

