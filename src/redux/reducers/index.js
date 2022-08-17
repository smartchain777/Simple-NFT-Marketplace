import  { combineReducers } from 'redux' ;

import orderReducer from './order' ;
import offerReducer from './offer' ;

export default combineReducers({
    order : orderReducer,
    offer : offerReducer
});