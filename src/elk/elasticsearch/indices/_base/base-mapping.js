const index = {
	settings:{
		index: {
			auto_expand_replicas: "0-1"
		},
	},
	mappings: {
		properties:{
			disable: {
				type: "boolean"
			},
			url: {
				type: "keyword"
			},
			name: {
				type: "keyword"
			},
			id: {
				type: "keyword"
			},
			updatedAt: {
				type: "date"
			},
			createdAt: {
				type: "date"
			},
		}
	}
};
module.exports = index;
