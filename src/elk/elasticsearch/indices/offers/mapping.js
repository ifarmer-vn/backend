const baseMapping = require("../_base/page-mapping");
const index = {
	settings: {
		...baseMapping.settings
	},
	mappings: {
		properties:{
			...baseMapping.mappings.properties,
			"price": {
				"type": "float"
			},
			"producturl": {
				"type": "keyword"
			},
			"name": {
				"type": "keyword"
			},
			"phone": {
				"type": "keyword"
			},
			"description": {
				"type": "text"
			},
			"address": {
				"type": "text"
			},
			"thoigianthuhoach": {
				"type": "keyword"
			},
			"loaihinh": {
				"type": "keyword"
			},
			"loaihinhkhac": {
				"type": "keyword"
			},
			"chungnhan": {
				"type": "keyword"
			},
			"loaiban": {
				"type": "keyword"
			},
			"dieukienban": {
				"type": "keyword"
			},
			"url": {
				"type": "keyword"
			},
			images: {
				type: "nested"
			},

		}
	}
};

module.exports = index;
