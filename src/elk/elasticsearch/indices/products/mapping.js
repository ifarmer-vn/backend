const baseMapping = require("../_base/page-mapping");
const index = {
	mappings: {
		properties:{
			...baseMapping.mappings.properties,
			"price": {
				"type": "float"
			},
			"original_price": {
				"type": "float"
			},
			"specs": {
				"type": "nested"
			},
			"unit": {
				"type": "keyword"
			},
			"related_products": {
				"type": "keyword"
			},
			"related_articles": {
				"type": "keyword"
			},
			"category": {
				"type": "keyword"
			}
		}
	}
};

module.exports = index;
