const baseMapping = require("../_base/page-mapping");
const index = {
	mappings: {
		properties:{
			...baseMapping.mappings.properties,
			"extraTitle": {
				"type": "keyword"
			},
			"price": {
				"type": "integer"
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
			"content": {
				"type": "text"
			}
		}
	}
};

module.exports = index;
