const request = require("request");
const {createTasks, executeTasks,saveDataToFile} = require("../../utils");

const getAll = contentName => () => {
    return new Promise(resolve => {
        request.get({
            url: `http://localhost:1337/${contentName}?_limit=10000`,
        }, async function callback(error, response, body) {
            if(error){
                console.log(error);
            }
            console.log("getAll", contentName, body.length);
            saveDataToFile("test.json",body);
            let info = JSON.parse(body);
            resolve(info);
        })
    });
};


const deleteAll = contentName => async () => {
    let data = await getAll(contentName)();
    console.log("delete total", data.length);
    data = data.length ? data : [];
    let deleteAllTasks = [];
    const deleteSingleTask = createTasks(deleteAllTasks);
    data.map(item => deleteSingleTask(async () => {
        await deleteByID(contentName)(item._id);
    }));
    await executeTasks(deleteAllTasks, {thread: 100});
};
const deleteByID = contentName => _id => {
    return new Promise(resolve => {
        console.log("Delete", _id);
        request.delete({
            url: `http://localhost:1337/${contentName}/${_id}`
        }, async function callback(error, response, body) {
            const info = JSON.parse(body);
            resolve(info);
        });
    });
};
const update = contentName => data => {
    return new Promise(resolve => {
        console.log("Updated", data._id);
        request.put({
            url: `http://localhost:1337/${contentName}/${data._id}`
        }, async function callback(error, response, body) {
            if(error){
                console.log(error);
            }
            const info = JSON.parse(body);
            resolve(info);
        }).form(data);
    });
};

const revealed = {
    getAll,
    deleteAll,
    update,
    deleteByID,
};

module.exports = revealed;