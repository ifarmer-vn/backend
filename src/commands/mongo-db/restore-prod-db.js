const {restoreData} = require('../../mongodb');

const main = async () => {
    const data =  require("../../../backup/prod-db-2019-11-10");
    await restoreData(data);
};

console.time('Restore PROD DB');
main().then(() => {
    console.timeEnd('Restore PROD DB');
});
