const index = {
	mappings: {
		properties: {
			dateCreated: {
				type: "keyword"
			},
			dateModified: {
				type: "keyword"
			},
			id: {
				type: "keyword"
			},
			image: {
				type: "keyword"
			},
			shortDescription: {
				type: "text"
			},
			smallImage: {
				type: "keyword"
			},
			popularity: {
				type: "keyword"
			},
			author: {
				type: "keyword"
			},
			category: {
				type: "keyword"
			},
			product: {
				type: "keyword"
			},
			created: {
				type: "keyword"
			},
			content: {
				type: "text"
			}
		}
	}
};
module.exports = index;