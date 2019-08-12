const fs = require("fs");
const util = require("../utils");
const config = require("./config");
const getDataFromFile = async file => {
    const data = await util.getDataFromCSV(file);
    return data;
};
const parseData = data => {
    let result = {
        summary: {
            totalURL: 0,
            totalImpression: 0,
            totalClick: 0,
            totalKeywords: 0
        },
        data: {}
    };
    data.map(raw => {
        if (raw) {
            const item = JSON.parse(raw);
            let url = item.keys[0];
            const impressions = item.impressions;
            const clicks = item.clicks;
            let keyword = {
                keyword: item.keys[1],
                clicks: clicks,
                impressions: impressions,
                ctr: item.ctr,
                position: item.position,
            };
            result.summary.totalImpression += impressions;
            result.summary.totalClick += clicks;
            result.summary.totalKeywords++;

            let page = result.data[url];
            if (page) {
                page.keywords.push(keyword);
            } else {
                result.summary.totalURL++;
                result.data[url] = {
                    url,
                    keywords: [keyword],
                };
            }
        }
    });
    return result;
};

main();

async function main() {
    const data = await getDataFromFile(config.storeFile);
    const parsedData = parseData(data);
}
