const fs = require('fs');

const updateRawDataInToFile = (file, data) => {
    return new Promise(resolve => {
        let lineArray = [];
        data.forEach(function (infoArray) {
            lineArray.push(JSON.stringify(infoArray));
        });
        let csvContent = lineArray.join("\n");
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

const revealed = {
    updateRawDataInToFile
};

module.exports = revealed;