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
    sheets_init().then(sheets_fetch),
    new Promise((_, reject) => setTimeout(() => reject(), 1500))
])
.catch(err => {
    // If something went wrong fetching data from google,
    // display a warning and load from localStorage instead
    document.getElementById("offline_warning").style.display = 'block';
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
        {name: 'value', getFn: (part) => format_value(part)},
        {name: 'location' },
        {name: 'description' },
        {name: 'footprint' },
        {name: 'tolerance', getFn: (part) => format_tolerance(part)},
        {name: 'rating' },
        {name: 'projects' },
        {name: 'digikey' },
    ], ignoreLocation: true});

    // Show the table with all the parts
    build_table(parts);
});

// Called on keyup in the search box
function filter_parts() {
    let table = document.getElementById("parts_table");
    let input = document.getElementById("parts_search");
    if (input.value == "") {
        filtered = parts.slice();
    } else {
        // First do a fuzzy search on the parts array
        filtered = fuse.search(input.value).map(entry => entry.item);
        // Additionally, if the user entered a number
        if ((parsed = parse_value(input.value))) {
            // Then find all of the parts with a value within 10% of the search
            let close = parts.filter(part => Math.abs(parsed[0] - part.value) <= 0.1 * parsed[0]);
            // Sorted by error
            close.sort((a, b) => Math.abs(parsed[0] - a) - Math.abs(parts[0] - b));
            // And display those first
            filtered = [...close, ...filtered.filter(part => !close.includes(part))];
        }
    }

    build_table(filtered);
}

let sorting_key = ''; // The key we are currently sorting by
let sorting_reversed = -1; // The current sort direction
// Called on click of one of the headers
function sort_parts(key) {
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
    filtered.sort(compare);
    build_table(filtered);
}
