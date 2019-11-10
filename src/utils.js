const fs = require('fs');

const createDir = (dir) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
};

const saveDataToFile = (path, data) => {
    fs.writeFileSync(path, JSON.stringify(data));
};
const updateRawDataInToFile = (file, data) => {
    return new Promise(resolve => {
        let lineArray = [];
        data.forEach(function (infoArray) {
            lineArray.push(JSON.stringify(infoArray));
        });
        let csvContent = lineArray.join("\n");
        csvContent += "\n";
        fs.appendFile(file, csvContent, 'utf8', function (err) {
            if (err) {
                console.log('Some error occurred - file either not saved or corrupted file saved.');
            } else {
                console.log(file, 'It\'s updated!');
            }
            resolve();
        });
    });
};

const getDataFromCSV = path => {
    let defered = new Promise(resolve => {
        fs.readFile(path, 'utf8', function (err, data) {
            console.log(data.length);
            resolve(data.split("\n"));
        });
    });
    return defered;
};
const regexMatching = regexString => (str, cb) => {
    return new Promise(async resolve => {
        let matches;
        // console.time("regexMatching" + str.length);
        // console.log("regexString", regexString);
        while ((matches = regexString.exec(str))) {
            // console.log("start cb");
            await cb(matches);
            // console.log("end  cb");
        }
        // console.timeEnd("regexMatching" + str.length);
        resolve();
    });
};
const regexMatchingSync = regexString => (str, cb) => {
    let matches;
    while ((matches = regexString.exec(str))) {
        cb(matches);
    }
};

String.prototype.replaceAll = function (search, replacement) {
    let target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

const executeAsync = tasks => {
    // const timeStart = "timeStart-" + (+new Date());
    // console.time(timeStart);
    return new Promise(resolve => {
        let promises = [];
        tasks.map(task => {
            promises.push(task());
        });
        Promise.all(promises).then(() => {
            // console.timeEnd(timeStart);
            resolve();
        });
    });
};

const createTasks = tasks => task => {
    tasks.push(task);
};
const executeTasks = async (tasks, opt) => {
    const thread = opt.thread || 10;
    let currentTasks = tasks.splice(0, thread);
    while (currentTasks.length) {
        await executeAsync(currentTasks);
        currentTasks = tasks.splice(0, thread);
    }
};

const getYYYYMMDD = ()=>{
    const dateObj = new Date();
    const month = dateObj.getUTCMonth() + 1; //months from 1-12
    const day = dateObj.getUTCDate();
    const year = dateObj.getUTCFullYear();

    return `${year}-${month}-${day}`;
};

const getDataFromJSON = (jsonPath)=>{
    return require(jsonPath);
};

const revealed = {
    getYYYYMMDD,
    createDir,
    saveDataToFile,
    updateRawDataInToFile,
    createTasks,
    executeTasks,
    getDataFromCSV,
    regexMatching,
    regexMatchingSync,
    executeAsync
};

module.exports = revealed;
