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
			title: {
				type: "keyword"
			},
		}
	}

};
module.exports = index;