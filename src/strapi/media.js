const request = require("request");
const fs = require("fs");
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
    console.log(uri);
    return new Promise(resolve => {
        request.head(uri, function (err, res, body) {
            request(uri).pipe(fs.createWriteStream(filename)).on('close', () => {
                console.log("downloaded", filename);
                resolve(filename);
            });
        });
    });
};

const revealed = {
    upload,
    download
};
module.exports = revealed;
