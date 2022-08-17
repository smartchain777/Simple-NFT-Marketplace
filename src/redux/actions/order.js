
import ActionTypes from './actionTypes';

import axios from 'axios' ;

import { BACKEND_URL } from '../../constant';


export const GetOrderData = () => async dispatch => {
    try{
        let result = await axios.post(`${BACKEND_URL}order/get`) ;
        dispatch({
            type: ActionTypes.GetOrderData,
            payload : result.data.data
        })
    }
    catch(err){
        console.log(err);
    }
}

export const AddOrder = (data) => {
    try{
        axios.post(`${BACKEND_URL}order/add`, data) ;
    }
    catch(err){
        console.log(err);
    }
}

export const RunOrder = (data) => {
    try{
        axios.post(`${BACKEND_URL}order/run`, data) ;
    }
    catch(err){
        console.log(err);
    }
}

