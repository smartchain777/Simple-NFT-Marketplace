
import ActionTypes from './actionTypes';

import axios from 'axios' ;

import { BACKEND_URL } from '../../constant';


export const GetOfferData = () => async dispatch => {
    try{
        let result = await axios.post(`${BACKEND_URL}offer/get`) ;
        dispatch({
            type: ActionTypes.GetOfferData,
            payload : result.data.data
        })
    }
    catch(err){
        console.log(err);
    }
}

export const AddOffer = (data) => {
    try{
        axios.post(`${BACKEND_URL}offer/add`, data) ;
    }
    catch(err){
        console.log(err);
    }
}

export const RemoveOffer = (id) => {
    try{
        axios.post(`${BACKEND_URL}offer/delete/${id}`, {}) ;
    }
    catch(err){
        console.log(err);
    }
}

