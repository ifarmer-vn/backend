const baseMapping = require("../_base/page-mapping");
const index = {
	mappings: {
		properties:{
			...baseMapping.mappings.properties,
			"productSource":{
				"type": "nested"
			},
			"categorySource": {
				"type": "nested"
			},
			"extraTitle": {
				"type": "keyword"
			},
			"title": {
				"type": "keyword"
			},
			"price": {
				"type": "keyword"
			},
			"product": {
				"type": "keyword"
			},
			"variantTypes": {
				"type": "nested"
			},
			"original_price": {
				"type": "float"
			},
		}
	}
};

module.exports = index;
