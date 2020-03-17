const fs = require('fs');
const sharp = require('sharp');
const dir = require('./dir');

function readFile(filePath) {
	return new Promise((resolve, reject) => {
		fs.readFile(filePath, (err, data) => {
			if (err) reject(err);
			resolve(data);
		});
	});
}

function createPath(filePath, rootFolder) {
	// filePath = cropped/ga-tha-vuon/ga-tha-vuon10.jpg

	rootFolder = rootFolder || "cropped/";
	console.log(filePath);
	let arr = filePath.split("/");
	let path = rootFolder + arr[1];
	dir.make(path);
	return path + "/" + arr[2];

	 // return rootFolder + "/" + filePath;
}

async function crop(filePath) {
	let des = createPath(filePath);
	return sharp(filePath).toFile(des, (err, info) => {
		console.log("Cropped file", des);
	});
}

async function checkFile(filePath) {
	return readFile(filePath).then(data => {
		if (data.length < 10048) {
			console.log("remove", filePath);
			fs.unlink(filePath, () => {
			});
			return false;
		}
		return true;
	});
}

function uploadFilePath(filePath) {
	return readFile(filePath).then(file => {
		return upload(file, filePath);
	});
}

function upload(file, filePath) {
}

function downloadAll(path) {

}

const image = {
	upload: upload,
	readFile: readFile,
	uploadFilePath: uploadFilePath,
	checkFile: checkFile,
	downloadAll: downloadAll,
	crop: crop
};
module.exports = image;