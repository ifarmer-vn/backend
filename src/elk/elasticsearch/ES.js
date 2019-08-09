const elasticsearch = require('elasticsearch');
const credential = require("./credential");

const client = new elasticsearch.Client({
	host: [
		{
			host: '127.0.0.1',
			auth: credential.auth,
			protocol: 'http',
			port: 9200
		}
	]
});

module.exports = Object.freeze(client);