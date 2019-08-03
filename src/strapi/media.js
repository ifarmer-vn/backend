const request = require("request");
const fs = require("fs");

const upload = body1 => {
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
             console.log(response) // 'image/png'
            // console.log(response.statusCode) // 200
        });
        //
        // const body = {
        //     "files": {
        //         files: file
        //     }, // Buffer or stream of file(s)
        //     fields: {
        //         "refId": "5d4317959c888723682632c8", // User's Id.
        //         "path": "", // Uploading folder of file(s).
        //         "ref": "categories", // Model name.
        //         // "source": "content-manager", // Plugin name.
        //         "field": "images" // Field name in the User model.
        //
        //     }
        // };
        // request.post({
        //     url: 'http://localhost:1337/upload',
        //     formData: form
        // }, function optionalCallback(err, httpResponse, body) {
        //     if (err) {
        //         return console.error('upload failed:', err);
        //     }
        //     console.log('Upload successful!  Server responded with:', body);
        // });
        // request.post("http://localhost:1337/upload").form(body).on('response', function(response) {
        //     // console.log(response) // 'image/png'
        //     console.log(response.statusCode) // 200
        // });
    });
};

const revealed = {
    upload,
};
module.exports = revealed;
