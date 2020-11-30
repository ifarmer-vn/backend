const crawl = require("./crawlGoogle");
const crawlImage = require("./crawlGoogleImage");
const downloadImage = require("./downloadImage");
const dir = require("./dir");
const keywordGen = require("./keyword");
const html = require("./html");
const crawlWiki = require("./crawlWiki");
const parseData = require("./parseData");
const saveFile = require("./saveFile");
const csv = require("./csv");
const fs = require('fs');
let unableFillDataKeywords = [];
let deferred = [];

const crawlItem = (item) => {
    return new Promise(async resolve1 => {
        if (!item[0]) {
            resolve1();
            return;
        }
        let keyword = keywordGen.keywordSearch(item[0]);
        let price, variant;
        if (!isNaN(item[1])) {
            price = parseInt(item[1]);
        } else {
            variant = item[1];
        }
        if (item[2]) {
            price = parseInt(item[2]);
        }
        let googleURL = "https://www.google.com.vn/search?q=" + keyword;
        let deferrer = await crawl.crawl(googleURL).then(async (data) => {
            if (!data) {
                unableFillDataKeywords.push({
                    googleURL: googleURL,
                    keyword: keyword
                });
                console.error("Can not find data for this keyword:", keyword);
                return;
            }
            let processedData = parseData.parse(data[0]);
            processedData.name = item[0];
            if (price) {
                processedData.price = price;
            }
            processedData.id = keywordGen.create(processedData.name);
            dir.make("google/" + processedData.id);
            if (variant) {
                processedData.variants = variant;
            }
            processedData.title = processedData.name;
            processedData.wikiURL = data[1];
            processedData.googleURL = googleURL;
            await crawlImage.crawl(googleURL + "&tbm=isch").then(async res => {
                console.log(res.length);
                processedData.listImages = res;
                downloadImage.downloadAll(res, processedData.id);
                if (!processedData.wikiURL) {
                    await saveFile.save("google/" + processedData.id + "/" + processedData.id + ".json", JSON.stringify(processedData));
                } else {
                    crawlWiki.crawl(processedData.wikiURL).then(async (res) => {
                        processedData.wikiDoc = html.parseHTML(res);
                        await saveFile.save("google/" + processedData.id + "/" + processedData.id + ".json", JSON.stringify(processedData));
                        // translate.go("Hello world").then(data=>{
                        // 	processedData.wikiDocVN = data;
                        // 	saveFile.save("google/" + keyword + ".json", JSON.stringify(processedData));
                        // });
                    });
                }
            });

        });
        deferred.push(deferrer);
        Promise.all(deferred).then(async () => {
            console.log("Done crawl Item");

            if (unableFillDataKeywords.length !== 0) {
                await saveFile.save("google/unable-fill-data-keywords.json", JSON.stringify(unableFillDataKeywords));
            }
            resolve1();
        });

    })
};

function start() {

    dir.make("google");
    dir.make("ifarmer");
    const file = "src/google-crawl/google-keywords.csv";
    fs.readFile(file, 'utf8', async function (err, data) {
        let arr = csv.CSVToArray(data);
        for (let i = 0; i < arr.length; i++) {
            const item = arr[i];
            if (!item) {
                continue;
            }
            console.log(item);
            await crawlItem(item);
        }
    });

}

const revealed = {
    start
};

module.exports = revealed;
