const index = {
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
