const fs = require('fs');

function make(path) {
	if (!fs.existsSync(path)) {
		fs.mkdirSync(path);
	}
}

const revealed = {
	make: make,
};

module.exports = revealed;