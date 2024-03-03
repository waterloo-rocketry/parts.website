// Register service worker
if ('serviceWorker' in navigator) {
    // Wait for the 'load' event to not block other work
    window.addEventListener('load', async () => {
        // Try to register the service worker.
        try {
            await navigator.serviceWorker.register('/serviceWorker.js');
        } catch (err) {
            console.log('😥 Service worker registration failed: ', err);
        }
    });
}

let parts; // Array of all the part objects we loaded
let filtered; // Subset of parts that matches the user's search
let fuse; // index to quickly fuzzy search over parts

// Use promise.race as a timeout for fetching data from google sheets.
Promise.race([
    sheetsInit().then(sheetsFetch),
    new Promise((_, reject) => setTimeout(() => reject(), 1500))
])
.catch(err => {
    // If something went wrong fetching data from google,
    // display a warning and load from localStorage instead
    document.getElementById("offline-warning").style.display = 'block';
    return JSON.parse(localStorage.getItem("parts"));
})
.then(data => {
    parts = data;
    console.log(parts);
    localStorage.setItem("parts", JSON.stringify(parts));
    filtered = parts.slice();

    // Init the fuzzy search index to search the parts array
    // on the listed keys.
    fuse = new Fuse(parts, {keys: [
        // Provide a custom getter function to format the numeric
        // value into a string to be searched.
        {name: 'value', getFn: (part) => formatValue(part)},
        {name: 'location' },
        {name: 'description' },
        {name: 'footprint' },
        {name: 'tolerance', getFn: (part) => formatTolerance(part)},
        {name: 'ratingA', getFn: (part) => formatValue(part)},
        {name: 'ratingV' },
        {name: 'ratingW' },
        {name: 'projects' },
        {name: 'digikey' },
    ], ignoreLocation: true});

    // Show the table with all the parts
    buildTable(parts);
});

// Called on keyup in the search box
function filterParts() {
    let table = document.getElementById("parts-table");
    let input = document.getElementById("parts-search");
    if (input.value == "") {
        filtered = parts.slice();
    } else {
        // First do a fuzzy search on the parts array
        filtered = fuse.search(input.value).map(entry => entry.item);
        // Additionally, if the user entered a number
        if ((parsed = parseValue(input.value))) {
            // Then find all of the parts with a value within 10% of the search
            let close = parts.filter(part => Math.abs(parsed[0] - part.value) <= 0.1 * parsed[0]);
            // Sorted by error
            close.sort((a, b) => Math.abs(parsed[0] - a.value) - Math.abs(parsed[0] - b.value));
            // And display those first
            filtered = [...close, ...filtered.filter(part => !close.includes(part))];
        }
    }

    // Update arrows on the table
    for (th of document.querySelectorAll("#parts-table tr th")) {
        th.className = "";
    }

    buildTable(filtered);
}

// extract numerical fraction from string. 
function extractNumberFromString(str) {
    const match = str.match(/\d+(\.\d+)?(\/\d+)?/);
    return match ? eval(match[0]) : null;
}


let sorting_key = ''; // The key we are currently sorting by
let sorting_reversed = -1; // The current sort direction
// Called on click of one of the headers
function sortParts(key) {
    // Figure out the correct sort direction so that it reverses
    // if already sorting by the clicked header.

    if (sorting_key == key) {
        sorting_reversed *= -1;
    } else {
        sorting_reversed = -1;
    }
    sorting_key = key;

    function compare(a, b) {
        a = a[key];
        b = b[key];
        // First compare by type, then by value. This has the effect of
        // properly (numerically) sorting part values, and then alphabetizing
        // part numbers, both in the 'Part' column.
        if (typeof a != typeof b) {
            a = typeof a;
            b = typeof b;
        }
        if (a < b) return sorting_reversed;
        if (a > b) return -sorting_reversed;
        return 0;
    }
    // specific comparisin function for rating.
    function compareRatings(a, b) {
        a = a[key];
        b = b[key];
        // extract numerical value from string. 
        numberA = extractNumberFromString(a);
        numberB = extractNumberFromString(b);
        // push all empty values to bottom.
        if (a === "") {
            return sorting_reversed;
        }
        if (numberA < numberB) {
            return sorting_reversed;
        }
        if (numberA > numberB) {
            return -sorting_reversed;
        }
        return 0; 
    }

    // Use different compare function based on column.
    if (key === "ratingA" || key === "ratingV" || key === "ratingW") {
        filtered.sort(compareRatings);
    } else {
        filtered.sort(compare);
    }
    
    
    

    // Update arrows on the table
    for (th of document.querySelectorAll("#parts-table tr th")) {
        th.className = "";
    }
    event.target.className = sorting_reversed == 1 ? "headerSortUp" : "headerSortDown";

    buildTable(filtered);
}