const fs = require("fs");
const util = require("../utils");
const {getAllData} = require("../strapi/strapi");
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
        pages: {}
    };
    data.map(raw => {
        if (raw) {
            const item = JSON.parse(raw);
            let url = item.keys[0];
            const impressions = item.impressions;
            const clicks = item.clicks;

            const ctr = item.ctr;
            const position = item.position;
            let keyword = [
                item.keys[1],
                clicks,
                impressions,
                ctr,
                position,
            ];
            result.summary.totalImpression += impressions;
            result.summary.totalClick += clicks;
            result.summary.totalKeywords++;

            let page = result.pages[url];
            if (page) {
                page.clicks += clicks;
                page.impressions += impressions;
                page.clicks += clicks;
                page.keywords.push(keyword);
            } else {
                result.summary.totalURL++;
                result.pages[url] = {
                    url,
                    ctr,
                    position,
                    clicks,
                    impressions,
                    keywords: [keyword],
                };
            }
        }
    });
    return result;
};
const getCMSDataFromJSON = path => {
    const data = require(path);
    return data;
};
main();
const mappingDataBetweenCMSWithGSC = (CMSData, GSCData) => {
    const mapping = mappingData(GSCData.pages);
    let result = [];
    result = result.concat(mapping("categories", "", CMSData.categories));
    result = result.concat(mapping("articles", "bai-viet/", CMSData.articles));
    result = result.concat(mapping("variants", "san-pham/", CMSData.variants));
    return result;
};
const mappingData = pages => (modelName, path, modelRows) => {
    let result = [];
    modelRows.map(row => {
        const url = `http://ifarmer.vn/${path}${row.url}/`;
        // console.log(url);
        const page = pages[url];
        if (page) {
            result.push({
                _id: row._id,
                clicks: page.clicks,
                position: page.position,
                impressions: page.impressions,
                ctr: page.ctr,
                keywords: page.keywords,
                modelName: modelName
            })
        }
    });
    return result;
};
const executeAsync = tasks => {
    const timeStart = "timeStart-" + (+new Date());
    console.time(timeStart);
    return new Promise(resolve => {
        let promises = [];
        tasks.map(task => {
            promises.push(task());
        });
        Promise.all(promises).then(() => {
            console.timeEnd(timeStart);
            resolve();
        });
    });
};
const updateDataToCMS = data => {

    return new Promise(async (resolve, reject) => {
        let tasks = [];
        let blockTemp = [];
        for (let i = 0; i < data.length; i++) {
            let row = data[i];
            blockTemp.push(async () => {
                await updateData(row);
            });
            if (i % 5 === 0) {
                tasks.push(blockTemp);
                blockTemp = [];
            }
        }
        if (blockTemp.length > 0) {
            tasks.push(blockTemp);
        }
        for (let i = 0; i < tasks.length; i++) {
            await executeAsync(tasks[i])
        }
    });
};
const updateData = (row) => {
    const categoriesModel = require("../strapi/categories/categories");
    const variantsModel = require("../strapi/variants/variants");
    const articlesModel = require("../strapi/articles/articles");
    let model;
    switch (row.modelName) {
        case "categories":
            model = categoriesModel;
            break;
        case "variants":
            model = variantsModel;
            break;
        default:
            model = articlesModel;
    }
    delete row.modelName;
    return model.update(row);
};

async function main() {
    const strapiData = await getAllData();
    const data = await getDataFromFile(config.storeFile);
    const GSCData = parseData(data);
    const needUpdatedData = mappingDataBetweenCMSWithGSC(strapiData, GSCData);
    console.log(needUpdatedData.length);
    updateDataToCMS(needUpdatedData);
}
