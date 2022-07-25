
const intialState = {
    "currentAddress":
    {
        addressID:"",
    }
}


export default (state = intialState, action) => {
    switch (action.type) {
        case "addressUpdate":
            return {
                currentAddress : action.payload
            };
        default:
            return state;
    }
};
