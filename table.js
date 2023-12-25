// Helper to create a td element with the given text
function td(content) {
    let res = document.createElement("td");
    res.innerText = content;
    return res;
}

function build_table(data) {
    let table = document.getElementById("parts_table");
    // Just replace the entire table with the given data
    table.replaceChildren(table.children[0],
        ...data.map(part => {
            let tr = document.createElement("tr");
            tr.replaceChildren(
                td(format_value(part)),
                td(part.location),
                td(part.description),
                td(part.footprint),
                td(format_tolerance(part)),
                td(part.rating),
            );
            return tr;
        })
    );
}
