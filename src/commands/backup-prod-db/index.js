const {getAllData} = require('../../mongodb/index');
const utils = require('../../utils');

const getAllDataFromMongoDB = async () => {
    const data = await getAllData();
    utils.createDir("backup");
    const filePath = `backup/prod-db-${utils.getYYYYMMDD()}.json`;
    utils.saveDataToFile(filePath, data);
};

const main = async () => {
    await getAllDataFromMongoDB();
};

console.time('Backup DB');
main().then(() => {
    console.timeEnd('Backup DB');
});
