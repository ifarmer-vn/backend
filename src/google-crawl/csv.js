const fs = require('fs');
const es = require('event-stream');

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
		fs.readFile(path, 'utf16le', function (err, data) {
			console.log(data.length);
			let arr = CSVToArray(data, strDelimiter);
			resolve(arr);
		});
	});
	return defered;
}

function getArrDataFromLargeCSV(path, callback) {
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
}

function getArrDataLowerCaseFromCSV(path) {
	let defered = new Promise(resolve => {
		fs.readFile(path, 'utf8', function (err, data) {
			data = data.toLowerCase();
			console.log("data size", data.length);
			let arr = CSVToArray(data);
			resolve(arr);
		});
	});
	return defered;
}

const revealed = {
	CSVToArray: CSVToArray,
	getArrDataFromCSV: getArrDataFromCSV,
	getArrDataFromLargeCSV: getArrDataFromLargeCSV,
	getArrDataLowerCaseFromCSV: getArrDataLowerCaseFromCSV
};

module.exports = revealed;