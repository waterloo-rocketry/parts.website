const API_KEY = 'AIzaSyDMNWmtO7bsU7RcNmcJD91IVHJiCbqTAQw';
const DISCOVERY_DOC = 'https://sheets.googleapis.com/$discovery/rest?version=v4';
const SHEET_ID = '1NLXdFrLtgda5LWzMhjwzs9EuQLDXqR4jcgIqeNbPJr8';

function sheetsInit() {
    // Here we load the gapi 'client' module, and then tell it to
    // load the sheets API via the discovery doc URL.
    return new Promise(resolve => {
        gapi.load('client', async function() {
            await gapi.client.init({
                apiKey: API_KEY,
                discoveryDocs: [DISCOVERY_DOC],
            });
            resolve();
        });
    });
}

// In the future if we want oauth on the user (eg to update the sheet)
// the following code initializes that:

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


// The columns of the data sheet, in order.
const DATA_KEYS = ["value", "location", "description", "footprint", "tolerance", "ratingA", "ratingV", "ratingW", "projects", "digikey", "date"];

function sheetsFetch() {
    // Load the contents of the sheet as a 2d array
    return gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: SHEET_ID,
        range: 'A:H',
    }).then(response => {
        // Slice off the first row (column names);
        let data = response.result.values.slice(1);

        return data.map(row => {
            // First turn the row (an array of cell values) into an object based on DATA_KEYS
            let entry = Object.fromEntries(DATA_KEYS.map((k, i) => [k, row[i] || ""]));

            // If we can parse the value numerically, do so and set the unit field
            entry.unit = '';
            if ((parsed = parseValue(entry.value))) {
                entry.value = parsed[0];
                entry.unit = parsed[1];
            }

            // Parse the tolerance into a number
            entry.tolerance = parseTolerance(entry.tolerance);

            return entry;
        });
    });
}
