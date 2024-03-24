// Helper to create a td element with the given text
function td(content) {
    let res = document.createElement("td");
    res.innerText = content;
    return res;
}

function buildTable(data, section) {
    var width = window.innerWidth;
    let table = document.getElementById("parts-table");
    // initialize selection buttons and reset to default
    document.getElementById("select1").style.display = "inline-block";
    document.getElementById("select2").style.display = "inline-block";
    document.getElementById("select3").style.display = "inline-block";
    document.getElementById("select1").src = "image/unselected.png"
    document.getElementById("select2").src = "image/unselected.png"
    document.getElementById("select3").src = "image/unselected.png"
    // get elements by section
    var sec1 = document.getElementsByName("section1");
    var sec2 = document.getElementsByName("section2");
    var sec3 = document.getElementsByName("section3");
    var i;
    for (i = 0; i < sec1.length; i++) {
        sec1[i].style.display="none";
    }
    for (i = 0; i < sec2.length; i++) {
        sec2[i].style.display="none";
    }
    for (i = 0; i < sec3.length; i++) {
        sec3[i].style.display="none";
    }
    if (width > 1000) { // Check if fullscreen/desktop to display full page
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
        document.getElementById("select1").style.display = "none";
        document.getElementById("select2").style.display = "none";
        document.getElementById("select3").style.display = "none";
        for (i = 0; i < sec1.length; i++) {
            sec1[i].style.display="table-cell";
        }
        for (i = 0; i < sec2.length; i++) {
            sec2[i].style.display="table-cell";
        }
        for (i = 0; i < sec3.length; i++) {
            sec3[i].style.display="table-cell";
        }
    } else if (section == 1) { // replace table collumns based on section
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
        for (i = 0; i < sec1.length; i++) {
            sec1[i].style.display="table-cell";
        }
        document.getElementById("select1").src = "image/selected.png"
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
        for (i = 0; i < sec2.length; i++) {
            sec2[i].style.display="table-cell";
        }
        document.getElementById("select2").src = "image/selected.png"
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
        for (i = 0; i < sec3.length; i++) {
            sec3[i].style.display="table-cell";
        }
        document.getElementById("select3").src = "image/selected.png"
    }
}
