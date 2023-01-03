// Rounds a number (non Decimal) to n places
function roundN(num, places) {
    return Math.round(num * 10 ** places) / (10 ** places)
}

// Formats a Decimal
function formatValue(num) {
    if (num.gte(Decimal.NUMBER_MAX_VALUE)) {
        return "Infinite";
    } else {
        if (num.gte(1e3)) {
            // Exponent formatted
            return `${roundN(num.mantissa, 2)}e${num.exponent}`
        } else {
            return num.toString();
        }
    }
}

export {
    formatValue
};