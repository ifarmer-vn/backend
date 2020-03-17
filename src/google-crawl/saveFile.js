const fs = require('fs');

async function save(file, data) {
	fs.writeFile(file, data, 'utf8', function (err) {
		if (err) {
			console.log('Some error occured - file either not saved or corrupted file saved.');
		} else {
			console.log(file, 'It\'s saved!');
		}
	});
}

async function saveCSVFile(file, data) {
	let lineArray = [];
	data.forEach(function (infoArray, index) {
		let line = infoArray.join("\t");
		lineArray.push(line);
	});
	let csvContent = lineArray.join("\n");
	fs.writeFile(file, csvContent, 'utf8', function (err) {
		if (err) {
			console.log('Some error occured - file either not saved or corrupted file saved.');
		} else {
			console.log(file, 'It\'s saved!');
		}
	});
}

async function updateCSVFile(file, data) {
	return new Promise(resolve => {
		let lineArray = [];
		data.forEach(function (infoArray, index) {
			let line = infoArray.join("\t");
			lineArray.push(line);
		});
		let csvContent = lineArray.join("\n");
		let arr = file.split("/");
		console.log("test", arr[arr.length - 1]);
		fs.appendFile(file, csvContent, 'utf8', function (err) {
			if (err) {
				console.log('Some error occured - file either not saved or corrupted file saved.');
			} else {
				console.log(file, 'It\'s updated!');
			}
			resolve();
		});
	});
}

async function updateLargeCSVFolder(folder, data) {
	return new Promise(resolve => {
		let lineArray = [];
		data.forEach(function (infoArray, index) {
			let line = infoArray.join("\t");
			lineArray.push(line);
		});
		let csvContent = lineArray.join("\n");
		let file = folder + "/" + (+new Date()) + ".csv";
		fs.writeFile(file, csvContent, 'utf8', function (err) {
			if (err) {
				console.log('Some error occured - file either not saved or corrupted file saved.');
			} else {
				console.log(file, 'It\'s updated!');
			}
			resolve();
		});
	});
}

async function updateFile(file, data) {
	fs.readFile(file, 'utf8', function (err, currentData) {
		let result = currentData + "\n" + data;
		fs.writeFile(file, result, 'utf8', function (err) {
			if (err) {
				console.log('Some error occured - file either not saved or corrupted file saved.');
			} else {
				console.log(file, 'It\'s updated!');
			}
		});
	});
}


const revealed = {
	save: save,
	saveCSVFile: saveCSVFile,
	updateCSVFile: updateCSVFile,
	updateLargeCSVFolder: updateLargeCSVFolder,
	updateFile: updateFile
};

module.exports = revealed;