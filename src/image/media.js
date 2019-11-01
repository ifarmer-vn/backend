const request = require("request");
const fs = require("fs");
const sharp = require("sharp");
const utils = require("../utils");

const crop = async (filePath, desFolder, x, y) => {
    return new Promise(resolve => {
        return sharp(filePath).resize(x, y).toFile(desFolder, (err, info) => {
            console.log("Cropped file", desFolder);
            resolve(desFolder);
        });

    });
};


const upload = (modelName, fieldName) => (refId, filePath, path) => {
    return new Promise((resolve, reject) => {
        const formData = {
            // files: request(url),
            to: JSON.stringify({
                "refId": refId,
                "path": path,
                "ref": modelName,
                "field": fieldName
            })
        };
        if (filePath) {
            formData.files = fs.createReadStream(filePath);
        }
        var opts = {
            url: 'http://localhost:1337/upload',
            method: 'POST',
            json: true,
            formData: formData
        };
        request(opts, function (error, response, body) {
            // console.log(error);
            // console.log(body);
            resolve(body) // 'image/png'
        });

    });
};
const download = function (uri, filename) {
    return new Promise(resolve => {
        request.head(uri, function (err, res, body) {
            request(uri).pipe(fs.createWriteStream(filename)).on('close', () => {
                console.log("downloaded", filename);
                resolve(filename);
            });
        });
    });
};
const downloadImageFromFireBase = async url => {
    return new Promise(async resolve => {
        if (!url.includes("https://")) {
            console.log("not in firebase", url);
            resolve("/home/haibui/projects/ifarmer/backend/src/data-examples/" + url.replace("../", ""));
            return;
        }
        const path = url.split("?")[0].split("%2F");
        const fileName = "/home/haibui/projects/ifarmer/backend/src/data-examples/tmp/" + path[path.length - 1];
        await download(url, fileName);
        resolve(fileName);
    });

};

const revealed = {
    crop,
    upload,
    download,
    downloadImageFromFireBase
};
module.exports = revealed;
