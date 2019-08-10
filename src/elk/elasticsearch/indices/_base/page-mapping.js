const baseMapping = require("./base-mapping");
const index = {
	mappings: {
		properties:{
			...baseMapping.mappings.properties,
			description: {
				type: "text"
			},
			title: {
				type: "keyword"
			},
			robots: {
				type: "keyword"
			},
			images: {
				type: "nested"
			},
			search_volume: {
				type: "integer"
			},
			click: {
				type: "integer"
			},
			ctr: {
				type: "float"
			},
			impression: {
				type: "integer"
			},
			redirect: {
				type: "keyword"
			},
			heading: {
				type: "keyword"
			},
		}
	}
};
module.exports = index;
