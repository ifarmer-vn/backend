const baseMapping = require("../_base/page-mapping");
const index = {
	mappings: {
		properties:{
			...baseMapping.mappings.properties,
			"productSource":{
				"type": "nested",
				"properties": {
					"url": {
						"type": "text"
					},
					"title": {
						"type": "text"
					}
				}
			},
			"categorySource": {
				"type": "nested",
				"properties": {
					"url": {
						"type": "text"
					},
					"title": {
						"type": "text"
					}
				}
			},
			"extraTitle": {
				"type": "keyword"
			},
			"title": {
				"type": "keyword"
			},
			"category":{
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
