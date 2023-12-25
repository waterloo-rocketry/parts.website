const UNITS = ["R", "F", "H", "A", "Hz"];
const PREFIXES  = {"p": 1E-12, "n": 1E-9, "µ": 1E-6, "u": 1E-6, "m": 1E-3, "R": 1, "k": 1E3, "M": 1E6};

// Part a value of the form 10k, 1R5, 300 pF, 10R, etc
// into an absolute numeric value and a unit.
function parse_value(str) {
    let unit = "R";
    // Strip a trailing unit if one exists, otherwise default to ohms
    for (const u of UNITS) {
        if (str.endsWith(u)) {
            str = str.slice(0, -u.length);
            unit = u;
            break;
        }
    }
    // Split on any of PREFIXES to parse things like 2k20 (2.2k)
    let split = str.split(new RegExp("(" + Object.keys(PREFIXES).join("|") + ")", "g"));
    // If we instead just have a single number with no prefix
    // (and if that number isn't too long, eg molex part numbers)
    if (split.length == 1 && str.length <= 5 && str == parseFloat(str)) {
        return [parseFloat(str), unit];
    }
    // If there were multiple prefixes, reject
    if (split.length != 3) { return false; }
    let sigdigs = (split[0] + split[2]).replaceAll("0", "").length;
    // If there are too few/many significant digits
    // (ie this is a part number not a value), reject
    if (sigdigs < 1 || sigdigs > 5) { return false; }
    // If there is a trailing number, treat the prefix as a decimal place as in 2k20
    if (split[2]) {
        value = parseInt(split[0]) + parseInt(split[2]) / Math.pow(10, split[2].length);
    } else {
        value = parseFloat(split[0]);
    }
    // Get the absolute magnitude
    value *= PREFIXES[split[1]];
    return [value, unit];
}

const DISPLAY_PREFIXES = ["M", "k", "R", "m", "u", "n", "p"];
const OMIT_R = ["M", "k"];
function format_value(part) {
    if (part.unit == '') { return part.value; } // No unit means this is just a part number
    if (part.value == 0) { return part.value + part.unit; }
    // Find the largest prefix where there is no decimal
    // place, eg 1.2k should display as 1200R
    let res = part.value;
    let letter;
    for (letter of DISPLAY_PREFIXES) {
        let v = part.value / PREFIXES[letter];
        res = parseFloat(v.toFixed(2)) + " ";
        if (letter != "R") {
            res += letter;
        }
        // Break if there is no decimal part in v
        if (v >= 1 && (v % 1 < 1E-5 || 1 - (v % 1) < 1E-5)) break;
    }
    // Omit the R on resistors in the k and M range
    if (part.unit != "R" || !OMIT_R.includes(letter)) {
        res += part.unit;
    }
    return res;
}

function parse_tolerance(str) {
    // Just strip a % sign and make it a number
    return parseFloat(str.replace("%", "")) ?? '';
}

function format_tolerance(part) {
    if (!part.tolerance) return '';
    return part.tolerance + "%";
}
