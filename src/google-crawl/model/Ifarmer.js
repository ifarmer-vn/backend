const _ = require('lodash');
const firebase = require('../firebase');
const saveFile = require('../saveFile');

function getData(type) {
	const promise = firebase.getOriginPath();
	return promise.once('value').then(snapshot => {
		let data = snapshot.val();
		saveFile.save("backup/ifarmer/data" + (+new Date()) + ".txt", JSON.stringify(data));
		return data[type] || {};
	});
}
function getPath(path) {
	const promise = firebase.getPath(path);
	return promise.once('value').then(snapshot => {
		let data = snapshot.val();
		return data[type] || {};
	});
}

function pushDevToTest() {
	return getData("dev").then(devData => {
		let data = {
			"test": devData
		};
		return firebase.getOriginPath().update(data).then(updateData => {
			console.log("Pushed DEV to TEST");
			return updateData;
		});
	});
}
function pushTestToDev() {
	return getData("test").then(testData => {
		let data = {
			"dev": testData
		};
		return firebase.getOriginPath().update(data).then(updateData => {
			console.log("Pushed Test to DEV");
			return updateData;
		});
	});
}

const articles = {
	getPath: getPath,
	pushTestToDev: pushTestToDev,
	pushDevToTest: pushDevToTest
};
module.exports = articles;
