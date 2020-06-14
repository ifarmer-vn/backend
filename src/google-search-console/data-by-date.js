const {google} = require('googleapis');
const oauth2 = require('./oauth2');
const config = require("./config");
const utils = require("../utils");
const webmasters = google.webmasters({
    version: 'v3',
    auth: oauth2.oAuth2Client,
});

async function main() {
    let startDate = new Date(config.startDate);
    let endDate = new Date(config.endDate);
    let currentDate = startDate;
    while (currentDate <= endDate) {
        await getAllData(currentDate.yyyymmdd());
        currentDate = currentDate.addDays(1);
    }
}

async function getAllData(date) {
    let startRow = 0;
    let data = await doQuery(startRow, date);
    let count = 0;
    while (data.rows) {
        console.log("date", date);
        console.log("row", count += data.rows.length);
        console.log("startRow", startRow);
        startRow += config.rowLimit;
        data = await doQuery(startRow, date);
    }
}

function saveData(rows, date) {
    if (rows) {
        utils.appendCSVFile(config.storeFile, rows, (data) => {
            let lineStr = [
                ["url", "query", "clicks", "impressions", "ctr", "position", "date"].join("\t")
            ];
            data.forEach(function (infoArray) {
                let lineArray = [];
                if (infoArray) {
                    lineArray.push(...infoArray.keys, infoArray.clicks, infoArray.impressions, infoArray.ctr, infoArray.position, date);
                    lineStr.push(lineArray.join("\t"));
                }
            });
            let csvContent = lineStr.join("\n");
            csvContent += "\n";
            return csvContent;
        });
    }
}

async function doQuery(startRow, date) {
    console.log("date", date);
    const res = await webmasters.searchanalytics.query({
        siteUrl: config.siteUrl,
        requestBody: {
            startDate: date,
            endDate: date,
            rowLimit: config.rowLimit,
            startRow: startRow,
            dimensions: config.dimensions
        }
    });
    saveData(res.data.rows, date);
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
