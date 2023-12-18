const API_KEY = 'AIzaSyDMNWmtO7bsU7RcNmcJD91IVHJiCbqTAQw';
const DISCOVERY_DOC = 'https://sheets.googleapis.com/$discovery/rest?version=v4';
const SHEET_ID = '1NLXdFrLtgda5LWzMhjwzs9EuQLDXqR4jcgIqeNbPJr8';

function sheets_init() {
    return new Promise((resolve) => {
        gapi.load('client', async function() {
            await gapi.client.init({
                apiKey: API_KEY,
                discoveryDocs: [DISCOVERY_DOC],
            });
            resolve();
        });
    });
}

// In the future if we want oauth on the user (eg to update the sheet):
//tokenClient = google.accounts.oauth2.initTokenClient({
//    client_id: CLIENT_ID,
//    scope: SCOPES,
//    callback: (tokenResponse) => {
//        if (tokenResponse && tokenResponse.access_token) {
//            listMajors();
//        }
//    },
//});

// And then later, to trigger the auth flow:
//if (gapi.client.getToken() === null) {
//    tokenClient.requestAccessToken({prompt: ''});
//}
//... use token

let DATA_KEYS = ["part", "footprint", "location", "tolerance", "rating", "projects", "digikey", "date"];

function sheets_fetch() {
    return gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: SHEET_ID,
        range: 'Sheet1',
    }).then((response) => {
        let data = response.result.values.slice(1);

        return data.map((row) => Object.fromEntries(
            DATA_KEYS.map((k, i) => [k, row[i] || ""])
        ));
    });
}
