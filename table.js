// Helper to create a td element with the given text
function td(content) {
    let res = document.createElement("td");
    res.innerText = content;
    return res;
}

function buildTable(data) {
    var w = window.innerWidth;
    let table = document.getElementById("parts-table");
    // Just replace the entire table with the given data
    if (w > 1000) {
        table.replaceChildren(table.children[0],
            ...data.map(part => {
                let tr = document.createElement("tr");
                tr.replaceChildren(
                    td(formatValue(part)),
                    td(part.location),
                    td(part.description),
                    td(part.footprint),
                    td(formatTolerance(part)),
                    td(part.ratingA),
                    td(part.ratingV),
                    td(part.ratingW),
                );
                return tr;
            })
        );
    } else {
        table.replaceChildren(table.children[0],
            ...data.map(part => {
                let tr = document.createElement("tr");
                tr.replaceChildren(
                    td(formatValue(part)),
                    td(part.location),
                    td(part.description),
                );
                return tr;
            })
        );
    }
}
