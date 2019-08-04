const request = require("request");
const fs = require("fs");
const upload = (modelName, fieldName) => (refId, filePath, path) => {
    return new Promise((resolve, reject) => {
        var opts = {
            url: 'http://localhost:1337/upload',
            method: 'POST',
            json: true,
            formData: {
                files: fs.createReadStream(filePath),
                // files: request(url),
                to: JSON.stringify({
                    "refId": refId,
                    "path": path,
                    "ref": modelName,
                    "field": fieldName
                })
            }
        };
        request(opts, function (error, response, body) {
            console.log(error);
            console.log(body);
            resolve(body) // 'image/png'
        });

    });
};
const upload1 = b => {
    return new Promise((resolve, reject) => {

        let path = __dirname + "/test.png";
        var opts = {
            url: 'http://localhost:1337/upload',
            method: 'POST',
            json: true,
            formData: {
                files: fs.createReadStream(path),
                to: JSON.stringify({
                    // fields: {
                    "refId": "5d4317959c888723682632c8", // User's Id.
                    "path": "", // Uploading folder of file(s).
                    "ref": "categories", // Model name.
                    // "source": "content-manager", // Plugin name.
                    "field": "images" // Field name in the User model.

                    // }
                })
            }
        };
        request(opts, function (response) {
            resolve(response) // 'image/png'
        });

    });
};


const revealed = {
    upload,
};
module.exports = revealed;
