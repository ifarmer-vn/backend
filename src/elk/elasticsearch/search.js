const client = require("./ES");

const query = (index) => async (query) => {
	console.log("test");
	const data = await client.search({
		index: index,
		body: query
	});
	return data.hits;
};
const revealed = {
	query
};

module.exports = revealed;
