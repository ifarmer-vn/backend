const {google} = require('googleapis');
const oauth2 = require('./oauth2');
const config = require("./config")
const webmasters = google.webmasters({
    version: 'v3',
    auth: oauth2.oAuth2Client,
});

async function main() {
    await getAllData();
}

async function getAllData() {
    let startRow = 0;
    let data = await doQuery(startRow);
    let count = data.rows.length;
    while (data.rows) {
        console.log("startRow", startRow);
        console.log("row", count += data.rows.length);
        startRow += config.rowLimit;
        data = await doQuery(startRow);
    }
}

async function doQuery(startRow) {
    const res = await webmasters.searchanalytics.query({
        siteUrl: config.siteUrl,
        requestBody: {
            startDate: config.startDate,
            endDate: config.endDate,
            rowLimit: config.rowLimit,
            startRow: startRow,
            dimensions: config.dimensions
        }
    });
    return res.data;
}

const scopes = [
    'https://www.googleapis.com/auth/webmasters',
    'https://www.googleapis.com/auth/webmasters.readonly',
];

if (module === require.main) {
    oauth2
        .authenticate(scopes)
        .then(main)
        .catch(console.error);
}

module.exports = {
    main,
    client: oauth2.oAuth2Client,
};