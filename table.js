// Helper to create a td element with the given text
function td(content) {
    let res = document.createElement("td");
    res.innerText = content;
    return res;
}

function buildTable(data) {
    let table = document.getElementById("parts-table");
    // Just replace the entire table with the given data
    table.replaceChildren(table.children[0],
        ...data.map(part => {
            let tr = document.createElement("tr");
            tr.replaceChildren(
                td(formatValue(part)),
                td(part.location),
                td(part.description),
                td(part.footprint),
                td(formatTolerance(part)),
                td(part.rating),
            );
            return tr;
        })
    );
}
