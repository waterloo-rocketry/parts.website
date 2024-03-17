// Helper to create a td element with the given text
function td(content) {
    let res = document.createElement("td");
    res.innerText = content;
    return res;
}

function buildTable(data, section) {
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
        document.getElementById("section1").style.display = "none";
        document.getElementById("section2").style.display = "none";
        document.getElementById("section3").style.display = "none";
        document.getElementById("section1a").style.display = "table-cell";
        document.getElementById("section1b").style.display = "table-cell";
        document.getElementById("section2a").style.display = "table-cell";
        document.getElementById("section2b").style.display = "table-cell";
        document.getElementById("section3a").style.display = "table-cell";
        document.getElementById("section3b").style.display = "table-cell";
        document.getElementById("section3c").style.display = "table-cell";
    } else if (section == 1) {
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
        document.getElementById("section1").style.display = "inline-block";
        document.getElementById("section2").style.display = "inline-block";
        document.getElementById("section3").style.display = "inline-block";
        document.getElementById("section1").src = "image/selected.png";
        document.getElementById("section2").src = "image/unselected.png";
        document.getElementById("section3").src = "image/unselected.png";
        document.getElementById("section1a").style.display = "table-cell";
        document.getElementById("section1b").style.display = "table-cell";
        document.getElementById("section2a").style.display = "none";
        document.getElementById("section2b").style.display = "none";
        document.getElementById("section3a").style.display = "none";
        document.getElementById("section3b").style.display = "none";
        document.getElementById("section3c").style.display = "none";
    } else if (section == 2) {
        table.replaceChildren(table.children[0],
            ...data.map(part => {
                let tr = document.createElement("tr");
                tr.replaceChildren(
                    td(formatValue(part)),
                    td(part.footprint),
                    td(formatTolerance(part)),
                );
                return tr;
            })
        );
        document.getElementById("section1").style.display = "inline-block";
        document.getElementById("section2").style.display = "inline-block";
        document.getElementById("section3").style.display = "inline-block";
        document.getElementById("section1").src = "image/unselected.png";
        document.getElementById("section2").src = "image/selected.png";
        document.getElementById("section3").src = "image/unselected.png";
        document.getElementById("section1a").style.display = "none";
        document.getElementById("section1b").style.display = "none";
        document.getElementById("section2a").style.display = "table-cell";
        document.getElementById("section2b").style.display = "table-cell";
        document.getElementById("section3a").style.display = "none";
        document.getElementById("section3b").style.display = "none";
        document.getElementById("section3c").style.display = "none";
    } else if (section == 3) {
        table.replaceChildren(table.children[0],
            ...data.map(part => {
                let tr = document.createElement("tr");
                tr.replaceChildren(
                    td(formatValue(part)),
                    td(part.ratingA),
                    td(part.ratingV),
                    td(part.ratingW),
                );
                return tr;
            })
        );
        document.getElementById("section1").style.display = "inline-block";
        document.getElementById("section2").style.display = "inline-block";
        document.getElementById("section3").style.display = "inline-block";
        document.getElementById("section1").src = "image/unselected.png";
        document.getElementById("section2").src = "image/unselected.png";
        document.getElementById("section3").src = "image/selected.png";
        document.getElementById("section1a").style.display = "none";
        document.getElementById("section1b").style.display = "none";
        document.getElementById("section2a").style.display = "none";
        document.getElementById("section2b").style.display = "none";
        document.getElementById("section3a").style.display = "table-cell";
        document.getElementById("section3b").style.display = "table-cell";
        document.getElementById("section3c").style.display = "table-cell";
    }
}
