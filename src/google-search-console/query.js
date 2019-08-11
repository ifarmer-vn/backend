const {google} = require('googleapis');
const oauth2 = require('./oauth2');
const config = require("./config")
const webmasters = google.webmasters({
    version: 'v3',
    auth: oauth2.oAuth2Client,
});

async function main() {
    const res = await webmasters.searchanalytics.query(config.query);
    console.log(JSON.stringify(res.data));
    return res.data;
}

const scopes = [
    'https://www.googleapis.com/auth/webmasters',
    'https://www.googleapis.com/auth/webmasters.readonly',
];

if (module === require.main) {
    oauth2
        .authenticate(scopes)
        .then(main)
        .catch(console.error);
}

module.exports = {
    main,
    client: oauth2.oAuth2Client,
};