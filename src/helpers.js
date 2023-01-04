// Gets the CSS class bindings to use for a component based on if something is affordable or not
function getAffordClass(affordable) {
    return {
        "button-affordable": affordable,
        "button-unaffordable": !affordable
    };
}

export {
    getAffordClass
}