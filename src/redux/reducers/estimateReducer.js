
const intialState = {
    "newEstimate":{
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
        case "customerUpdate":
            return {
                newEstimate: action.payload,
            };
        default:
            return state;
    }
};
