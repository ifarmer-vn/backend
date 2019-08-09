const client = require("../../ES");
const version = "_v1";

const v = () => version;
const mapping = index => schema => client.indices
	.create({
			index: index,
			body: schema
		},
		function (err, resp, respcode) {
			console.log(err, resp, respcode);
		});

const createDocument = index => doc => client
	.index({
			index: index,
			body: doc
		},
		function (err, resp, respcode) {
			if (err && err.toJSON) {
				console.log("Test");
				console.log(err);
			}
		});

const revealed = {
	mapping,
	createDocument,
	v
};


module.exports = revealed;
