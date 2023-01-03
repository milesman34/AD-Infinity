// Rounds a number (non Decimal) to n places
function roundN(num, places) {
    return Math.round(num * 10 ** places) / (10 ** places)
}

// Formats a Decimal
function formatValue(num, decimalPlaces=2, floor=false) {
    if (num.gte(Decimal.NUMBER_MAX_VALUE)) {
        return "Infinite";
    } else {
        if (num.gte(1e3)) {
            // Exponent formatted
            let mantissa = roundN(num.mantissa, decimalPlaces);

            // The < 10 check is for an edge case where the mantissa rounds to 10, resulting in a number like 10e4 instead of 1e5
            return mantissa < 10 ? `${mantissa}e${num.exponent}` : `1e${num.exponent + 1}`;
        } else {
            if (floor) {
                return Math.floor(num).toString()
            } else {
                return roundN(num, decimalPlaces).toString();
            }
        }
    }
}

export {
    formatValue
};