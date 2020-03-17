const image = require("./image");

var fs = require('fs'),
	_ = require('lodash'),
	request = require('request');
const imageExtension = ["jpg", "jpeg", "png", "gif"];
const BASE_PATH = "google";
const DELAY = 0;

function download(uri, filename) {
	console.log('downloading:', uri, filename);
	request.head(uri, function (err, res, body) {
		request(uri).on('error', function (err) {
			// console.log("Remove", filename);
			// fs.unlink(filename);
		}).pipe(fs.createWriteStream(filename)).on('error', function (err) {
			console.log("Fire error", filename);
			fs.unlink(filename, () => {
			});
		}).on("close", function () {
			image.checkFile(filename).then(() => {
			});
		});
	});
}

function downloadAll(arr, filePath) {
	let offset = 0;

	_.each(arr, (item, index) => {
		let fileName = getFileName(item, filePath, index);
		let path = BASE_PATH + "/" + filePath;
		if (!fs.existsSync(path)) {
			fs.mkdirSync(path);
		}
		let filePath1 = path + "/" + fileName;

		try {
			download(item, filePath1);
		} catch (e) {
			fs.unlink(filePath1);
		}
	});
}

function getFileName(str, name, index) {
	let arr = str.split("/");
	let fileName = arr[arr.length - 1];
	fileName = fileName.split(".");
	let fileExtension = fileName[fileName.length - 1];
	fileExtension = fileExtension.split('?')[0];
	fileExtension = renameExtension(fileExtension);
	return name + index + "." + fileExtension;
}

function renameExtension(str) {
	return (_.includes(imageExtension, str)) ? str : "jpg";
}

const revealed = {
	download: download,
	downloadAll: downloadAll,
	getFileName: getFileName
};

module.exports = revealed;