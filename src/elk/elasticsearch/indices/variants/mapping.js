const index = {
	mappings: {
		properties: {
			dateCreated: {
				type: "keyword"
			},
			dateModified: {
				type: "keyword"
			},
			created: {
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
			hide: {
				type: "keyword"
			},
			price: {
				type: "keyword"
			},
			variantTypes: {
				type: "nested"
			},
			extraTitle: {
				type: "keyword"
			},
			images: {
				type: "nested"
			},
			product: {
				type: "keyword"
			}
		}
	}
};
module.exports = index;