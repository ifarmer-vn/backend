const {restoreProdData} = require('../../src/mongodb');

const main = async () => {
    const data =  require("../../backup/prod-db-2020-2-19-v1.json");
    await restoreProdData(data);
};

console.time('Restore PROD DB');
main().then(() => {
    console.timeEnd('Restore PROD DB');
});
