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
			"content": {
				"type": "text"
			},
			"specs": {
				"type": "nested"
			},
			"unit": {
				"type": "keyword"
			},
			"related_products": {
				"type": "nested"
			},
			"related_articles": {
				"type": "nested"
			},
			"category": {
				"type": "keyword"
			}
		}
	}
};

module.exports = index;
