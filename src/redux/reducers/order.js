import ActionTypes from "../actions/actionTypes";

const INITIAL_STATE = {
    orderData : [],
}

export default (state = INITIAL_STATE , action) => {

    console.log("reducer::actionType::", action.type, "data::", action.payload);

    switch(action.type){
        case ActionTypes.GetOrderData : 
            return ({
                ...state,
                orderData : action.payload
            })
        case ActionTypes.AddOrder : 
            return ({
                ...state,
                orderData : action.payload
            })  
        case ActionTypes.RunOrder : 
            return ({
                ...state,
                orderData : action.payload
            })
       default :
            return state ;
    }
}