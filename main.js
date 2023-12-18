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

function build_table(data) {
    let table = document.getElementById("parts_table");
    table.replaceChildren(table.children[0],
        ...data.map((entry) => {
            let tr = document.createElement("tr");
            tr.replaceChildren(...DATA_KEYS.map((k) => {
                let td = document.createElement("td");
                td.innerText = entry[k];
                return td;
            }));
            return tr;
        })
    );
}

let parts;
let fuse;

sheets_init()
.then(sheets_fetch)
.then((data) => {
    parts = data;
    console.log(parts);
    fuse = new Fuse(parts, {keys: DATA_KEYS, ignoreLocation: true});

    build_table(parts);
});

function filter_parts() {
    let table = document.getElementById("parts_table");
    let input = document.getElementById("parts_search");
    if (input.value == "") {
        build_table(parts);
    } else {
        let filtered = fuse.search(input.value);

        build_table(filtered.map((entry) => entry.item));
    }
}
