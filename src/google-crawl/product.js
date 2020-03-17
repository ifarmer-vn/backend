const _ = require('lodash');
const config = require('./config/config');

function create(json) {
	let specs = [], shortSpecs = [];
	return {
		content: json.wikiDoc || " ",
		variants: json.variants,
		id: json.id,
		category: config.category,
		name: json.name,
		price: json.price,
		shortSpecs: shortSpecs,
		specs: specs,
		title: json.name,
		dateCreated: new Date(),
		dateModified: new Date(),
	};
}

const revealed = {
	create: create
};

module.exports = revealed;