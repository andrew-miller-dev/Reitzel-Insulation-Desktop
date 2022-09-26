
const intialState = {
    "quoteChosen":{
        firstName:"",
        lastName:"",
        phone:"",
        email:"",
        city:"",
        postalCode:"",
        region:"",
        billing:"",
    }
}


export default (state = intialState, action) => {
    switch (action.type) {
        case "quoteUpdate":
            return {
                quoteChosen: action.payload,
            };
        default:
            return state;
    }
};
