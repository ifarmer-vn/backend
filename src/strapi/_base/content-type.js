const request = require("request");

const update = contentName => data => {
    return new Promise(resolve => {
        request.put({
            url: `http://localhost:1337/${contentName}/${data._id}`
        }, async function callback(error, response, body) {
            const info = JSON.parse(body);
            // console.log(info);
            resolve(info);
        }).form(data);
    });
};

const revealed = {
    update
};

module.exports = revealed;