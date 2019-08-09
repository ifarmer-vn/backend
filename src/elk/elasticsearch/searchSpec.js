const search = require("./search");

describe("search", () => {
	describe("query", () => {
		it("should return correct data 1", async () => {
			// Let's search!
			let output = await search.query("categories_v1")({
				"query": {
					"bool": {
						"must_not": {
							"bool": {
								"should": [
									{
										"match": {
											"hide": true
										}
									}
								]
							}
						}
					}
				}
			});
			expect(null).not.toEqual(output.total.value);
		});
	});
});