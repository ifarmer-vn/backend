const fs = require('fs');

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

const revealed = {
    updateRawDataInToFile,
    getDataFromCSV
};

module.exports = revealed;