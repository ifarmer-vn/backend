const cmsVariants = require("../strapi/variants/variants");
const esVariants = require("../elk/elasticsearch/indices/variants/index");
const variantIndex = require("../elk/elasticsearch/indices/variants/index");
const getAllVariantsInCMS = async () => {
    let variants = await cmsVariants.getAll();
    let result = {};
    variants.map((item) => {
        result[item["url"]] = item;
    });
    console.log(result["qua-anh-dao-loai-dac-biet-trong-luong-2-kg"]['images']);
    return result;
};

const getAllVariantsInES = async () => {
    const variants = await esVariants.getAll();
    let result = {};
    variants.map((item) => {
        result[item['_source']["url"]] = item;
    });
    console.log(result["qua-anh-dao-loai-dac-biet-trong-luong-2-kg"]['_source']['images']);
    return result;
};

const checkDataNeedProcessImages = (cmsData, esData) => {
    let result = [];
    for (let pp in esData) {
        if (esData[pp]['_source']['images']) {
            if (!esData[pp]['_source']['images']['transformed']) {
                result.push(esData[pp]);
            } else {
                if (esData[pp]['_source']['images']['_id'] !== cmsData[pp]['images']['_id']) {
                    result.push(esData[pp]);
                }
            }
        } else {
            console.log("missing images", pp);
        }
    }
    console.log('Data need transform', result.length);
    return result;
};
const main = async () => {

    let variant1 = {
        _id: "1",
        name: "bach-tuoc"
    };
    variantIndex.updateBulk([variant1]);
    // const cmsVariantsData = await getAllVariantsInCMS();
    // const esVariantsData = await getAllVariantsInES();
    // checkDataNeedProcessImages(cmsVariantsData, esVariantsData);
};

console.time('Start Enrich images');
main().then(() => {
    console.timeEnd('Start Enrich images');
});
