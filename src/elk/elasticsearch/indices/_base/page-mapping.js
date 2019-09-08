const baseMapping = require("./base-mapping");
const index = {
	mappings: {
		properties:{
			...baseMapping.mappings.properties,
			description: {
				type: "text"
			},
			content: {
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
			clicks: {
				type: "integer"
			},
			ctr: {
				type: "float"
			},
			impressions: {
				type: "integer"
			},
			position: {
				type: "float"
			},
			redirect: {
				type: "keyword"
			},
			heading: {
				type: "keyword"
			},
			// keywords: {
			// 	type: "object"
			// },
		}
	}
};
module.exports = index;
