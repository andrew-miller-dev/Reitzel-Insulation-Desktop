
const intialState = {
    "customers": [],
}


export default (state = intialState, action) => {
    switch (action.type) {
        case "quote_selected":
            return {
                quote_selected: action.payload,
            };
        case "quote_one":
            return {
                quote_one: action.payloadq,
            };
        default:
            return state;
    }
};
