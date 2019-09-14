const utils = require("../utils");
const media = require("../strapi/media");
const uploadImage = media.upload("", "");

const parse = async content => {
    const ampImgTagRegex = /(<amp-img)(.+?)(src=")(.+?)(")/sg;
    const nodeRegexMatching = utils.regexMatching(ampImgTagRegex);
    let result = [];
    console.log("start");
    await nodeRegexMatching(content, async matches => {
        return new Promise(async resolve => {
            const img = matches[4];
            console.log(img);
            const tempImg = await media.downloadImageFromFireBase(img);
            console.log(tempImg);

            const uploading = await uploadImage("", tempImg, "");
            const uploadedImage = uploading[0].url;
            result.push({
                img,
                uploadedImage
            });
            resolve();
        });
    });
    return result;
};

const ampToNoneAmp = content => {
    return new Promise(async resolve => {
        let newContent = content;
        const parsedData = await parse(content);
        parsedData.map(item => {
            newContent = newContent.replace(item.img, item.uploadedImage);
        });
        // newContent = newContent
            // .replaceAll("<amp-img", "<img")
            // .replaceAll("><\/amp-img>", "\>");
        resolve(newContent);
    });
};

const revealed = {
    parse,
    ampToNoneAmp,
};

module.exports = revealed;
