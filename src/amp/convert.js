const utils = require("../utils");
const media = require("../strapi/media");
const uploadImage = media.upload("", "");

const parse = async content => {
    const ampImgTagRegex = /(<img)(.+?)(src=")(.+?)(")/sg;
    const nodeRegexMatching = utils.regexMatching(ampImgTagRegex);
    let result = [];
    await nodeRegexMatching(content, async matches => {
        return new Promise(async resolve => {
            const img = matches[4];
            if (img.indexOf("../assets/img/") === 0) {
                const tempImg = await media.downloadImageFromFireBase(img);
                console.log(tempImg);

               const uploading = await uploadImage("", tempImg, "");
                const uploadedImage = uploading[0].url;
                result.push({
                    img,
                    uploadedImage
                });
            }
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
        newContent = newContent
            .replaceAll("<amp-img", "<img")
            .replaceAll("><\/amp-img>", "\>")
            .replaceAll("width=\"16\" height=\"9\"", "width=\"1600\" height=\"900\"");
        resolve(newContent);
    });
};

const revealed = {
    parse: parse,
    ampToNoneAmp,
};

module.exports = revealed;
