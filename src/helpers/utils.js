import { ethers } from 'ethers';

export const DECIMALS = (10**18);

export const ether = wei => wei / DECIMALS;

export const formatPrice = (price) => {
  const precision = 100; // Use 2 decimal places

  price = ether(price);
  price = Math.round(price * precision) / precision;
   
  return price;
};

export const toFixed = (x) => {
  if (Math.abs(x) < 1.0) {
    var e = parseInt(x.toString().split('e-')[1]);
    if (e) {
        x *= Math.pow(10,e-1);
        x = '0.' + (new Array(e)).join('0') + x.toString().substring(2);
    }
  } else {
    var e = parseInt(x.toString().split('+')[1]);
    if (e > 20) {
        e -= 20;
        x /= Math.pow(10,e);
        x += (new Array(e+1)).join('0');
    }
  }
  return x;
}

export const getLibrary = (provider) => {
  return new ethers.providers.Web3Provider(provider) ;
}