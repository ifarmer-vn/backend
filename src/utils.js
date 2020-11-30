const fs = require('fs');
const es = require('event-stream');
String.prototype.money = function () {
    let target = this;
    return target.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};
String.prototype.splice = function (idx, rem, str) {
    return this.slice(0, idx) + str + this.slice(idx + Math.abs(rem));
};

Date.prototype.addDays = function (days) {
    let date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
};
Date.prototype.yyyymmdd = function () {
    let mm = this.getMonth() + 1; // getMonth() is zero-based
    let dd = this.getDate();

    return [this.getFullYear(),
        (mm > 9 ? '' : '0') + mm,
        (dd > 9 ? '' : '0') + dd
    ].join('-');
};
const createDir = (dir) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
};

const saveDataToFile = (path, data) => {
    fs.writeFileSync(path, JSON.stringify(data));
};
const saveArrayToText = (path, data) => {
    let result = data.join("\n");
    fs.writeFileSync(path, result);

};
const appendCSVFile = (file, data, transformFn) => {
    return new Promise(resolve => {
        let csvContent = transformFn(data);
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
const getText = (path,options)=>{
    return new Promise(resolve => {
        fs.readFile(path, options || 'utf8', function (err, data) {
            console.log(data.length);
            resolve(data);
        });
    });
};
const updateRawDataInToFile = async (file, data) => {
    await appendCSVFile(file, data, (rows) => {
        let lineArray = [];
        rows.forEach(function (infoArray) {
            lineArray.push(JSON.stringify(infoArray));
        });
        let csvContent = lineArray.join("\n");
        csvContent += "\n";
        return csvContent;
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

const getYYYYMMDD = (dateObj) => {
    dateObj = dateObj || new Date();
    const month = dateObj.getUTCMonth() + 1; //months from 1-12
    const day = dateObj.getUTCDate();
    const year = dateObj.getUTCFullYear();

    return `${year}-${month}-${day}`;
};

const getDataFromJSON = (jsonPath) => {
    return require(jsonPath);
};

const removeItem = (array, item) => {
    const index = array.indexOf(item);
    // console.log("test", index);
    if (index !== -1) {
        array.splice(index, 1)
    }
};

async function removeContent(file) {
    return new Promise(resolve => {
        fs.writeFile(file, '', function () {
            resolve();
        })
    });
}

async function exportJsonFile(file, data) {
    return new Promise(resolve => {
        fs.writeFile(file, JSON.stringify(data), 'utf8', function (err) {
            if (err) {
                console.log('Some error occurred - file either not saved or corrupted file saved.');
            } else {
                // console.log(file, 'It\'s updated!');
            }
            resolve();
        });
    });
}

async function updateCSVFile(file, data) {
    return new Promise(resolve => {
        let lineArray = [];
        data.forEach(function (infoArray, index) {
            let line = infoArray.join("\,");
            lineArray.push(line);
        });
        let csvContent = lineArray.join("\n") + "\n";
        fs.appendFile(file, csvContent, 'utf8', function (err) {
            if (err) {
                console.log('Some error occurred - file either not saved or corrupted file saved.');
            } else {
                // console.log(file, 'It\'s updated!');
            }
            resolve();
        });
    });
}

async function saveCSVFile(file, data) {
    return new Promise(resolve => {
        let lineArray = [];
        data.forEach(function (infoArray, index) {
            if (infoArray.join) {
                let line = infoArray.join("\t");
                lineArray.push(line);
            }
        });
        let csvContent = lineArray.join("\n") + "\n";
        fs.writeFile(file, csvContent, 'utf8', function (err) {
            if (err) {
                console.log('Some error occurred - file either not saved or corrupted file saved.');
            } else {
                // console.log(file, 'It\'s updated!');
            }
            resolve();
        });
    });
}

function CSVToArray(strData, strDelimiter) {
    // Check to see if the delimiter is defined. If not,
    // then default to comma.
    strDelimiter = (strDelimiter || ",");

    // Create a regular expression to parse the CSV values.
    var objPattern = new RegExp(
        (
            // Delimiters.
            "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +

            // Quoted fields.
            "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +

            // Standard fields.
            "([^\"\\" + strDelimiter + "\\r\\n]*))"
        ),
        "gi"
    );


    // Create an array to hold our data. Give the array9
    // a default empty first row.
    var arrData = [[]];

    // Create an array to hold our individual pattern
    // matching groups.
    var arrMatches = null;


    // Keep looping over the regular expression matches
    // until we can no longer find a match.
    while (arrMatches = objPattern.exec(strData)) {

        // Get the delimiter that was found.
        var strMatchedDelimiter = arrMatches[1];

        // Check to see if the given delimiter has a length
        // (is not the start of string) and if it matches
        // field delimiter. If id does not, then we know
        // that this delimiter is a row delimiter.
        if (
            strMatchedDelimiter.length &&
            strMatchedDelimiter !== strDelimiter
        ) {

            // Since we have reached a new row of data,
            // add an empty row to our data array.
            arrData.push([]);

        }

        var strMatchedValue;

        // Now that we have our delimiter out of the way,
        // let's check to see which kind of value we
        // captured (quoted or unquoted).
        if (arrMatches[2]) {

            // We found a quoted value. When we capture
            // this value, unescape any double quotes.
            strMatchedValue = arrMatches[2].replace(
                new RegExp("\"\"", "g"),
                "\""
            );

        } else {

            // We found a non-quoted value.
            strMatchedValue = arrMatches[3];

        }


        // Now that we have our value string, let's add
        // it to the data array.
        arrData[arrData.length - 1].push(strMatchedValue);
    }

    // Return the parsed data.
    return (arrData);
}

function getArrDataFromCSV(path, strDelimiter) {
    let defered = new Promise(resolve => {
        fs.readFile(path, 'utf8', function (err, data) {
            if (err) {
                console.log(err);
            }
            console.log(path, data.length);
            let arr = CSVToArray(data, strDelimiter);
            resolve(arr);
        });
    });
    return defered;
}

const getArrDataFromLargeCSV = (path, callback) => {
    let defered = new Promise(resolve => {
        let arrData = [];
        let lineN = 0;
        let tempStr = "";
        console.log("Start file", path);
        var s = fs.createReadStream(path)
            .pipe(es.split())
            .pipe(es.mapSync(function (line) {
                    lineN++;
                    tempStr += "\n" + line;
                    if (lineN % 250502 === 0) {
                        // if (lineN  === 2) {
                        s.pause();
                        console.log(lineN);
                        let arr = CSVToArray(tempStr);
                        tempStr = "";
                        callback(arr, path, s);
                        arrData = [];
                    }

                })
                    .on('error', function (err) {
                        console.log('Error while reading file.', err);
                    })
                    .on('end', function () {
                        console.log('Read entire file.', lineN);
                        resolve(lineN);
                    })
            );
    });
    return defered;
};

const objToArray = (obj) => {
    // if(obj.length >1){}
    let result = [];
    for (pp in obj) {
        result.push(obj[pp]);
    }
    return result;
};

const removeVietnameseChar= alias=> {
    var str = alias;
    str = str.toLowerCase();
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g,"a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g,"e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g,"i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g,"o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g,"u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g,"y");
    str = str.replace(/đ/g,"d");
    str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g,"-");
    str = str.replace(/ + /g,"-");
    str = str.replace(/ /g,"-");
    str = str.replace(/--/g,"-");
    str = str.trim();
    return str;
};
const revealed = {
    objToArray,
    removeVietnameseChar,
    getYYYYMMDD,
    updateCSVFile,
    exportJsonFile,
    getDataFromJSON,
    removeContent,
    removeItem,
    createDir,
    saveDataToFile,
    appendCSVFile,
    updateRawDataInToFile,
    createTasks,
    executeTasks,
    getDataFromCSV,
    regexMatching,
    regexMatchingSync,
    saveCSVFile,
    getArrDataFromCSV,
    getArrDataFromLargeCSV,
    saveArrayToText,
    getText,
    executeAsync
};

module.exports = revealed;
