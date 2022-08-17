import ActionTypes from "../actions/actionTypes";

const INITIAL_STATE = {
    offerData : [],
}

export default (state = INITIAL_STATE , action) => {

    console.log("reducer::actionType::", action.type, "data::", action.payload);

    switch(action.type){
        case ActionTypes.GetOfferData : 
            return ({
                ...state,
                offerData : action.payload
            })
        case ActionTypes.AddOffer : 
            return ({
                ...state,
                offerData : action.payload
            })  
        case ActionTypes.RemoveOffer : 
            return ({
                ...state,
                offerData : action.payload
            })
       default :
            return state ;
    }
}