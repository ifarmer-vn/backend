
const index = {
	mappings: {
		properties: {
			brand: {
				type: "keyword"
			},
			category: {
				type: "keyword"
			},
			content: {
				type: "text"
			},
			key: {
				type: "keyword"
			},
			shortDescription: {
				type: "text"
			},
			shortSpecs: {
				type: "nested"
			},
			specs: {
				type: "nested"
			},
			title: {
				type: "keyword"
			},
			price: {
				type: "keyword"
			},
			id: {
				type: "keyword"
			},
			created: {
				type: "keyword"
			}

		}
	}

};
module.exports = index;