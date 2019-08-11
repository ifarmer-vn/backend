const {google} = require('googleapis');
const oauth2 = require('./oauth2');

const webmasters = google.webmasters({
    version: 'v3',
    auth: oauth2.oAuth2Client,
});

async function main() {
    const res = await webmasters.searchanalytics.query({
        siteUrl: 'http://ifarmer.vn',
        requestBody: {
            startDate: '2019-08-08',
            endDate: '2019-08-08',
        },
    });
    console.log(res.data);
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