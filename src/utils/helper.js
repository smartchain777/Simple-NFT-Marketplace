import { ethers } from 'ethers';

export const getLibrary = (provider) => {
    return new ethers.providers.Web3Provider(provider) ;
}