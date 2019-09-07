const request = require("request");

const getAll = contentName => () => {
    return new Promise(resolve => {
        request.get({
            url: `http://localhost:1337/${contentName}?_limit=100000`,
        }, async function callback(error, response, body) {
            console.log(contentName);
            let info = JSON.parse(body);
            resolve(info);
        })
    });
};
const update = contentName => data => {
    return new Promise(resolve => {
        console.log("Updated", data._id);
        request.put({
            url: `http://localhost:1337/${contentName}/${data._id}`
        }, async function callback(error, response, body) {
            const info = JSON.parse(body);
            console.log(info);
            resolve(info);
        }).form(data);
    });
};

const revealed = {
    getAll,
    update
};

module.exports = revealed;