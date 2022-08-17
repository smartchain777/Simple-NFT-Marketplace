import { InjectedConnector } from "@web3-react/injected-connector";


export const injected = new InjectedConnector({ supportedChainIds: [1, 3, 4, 5, 42, 1337, 31337] });

// export const BACKEND_URL = "http://10.10.10.173:5000/api/";
// export const HOST_URL = 'http://10.10.10.173:5000';
// export const BACKEND_URL = "http://8deb-188-43-235-177.ngrok.io/api/";
// export const HOST_URL = "http://8deb-188-43-235-177.ngrok.io";
export const BACKEND_URL = "http://testnet-marketplace-backend.herokuapp.com/api/";
export const HOST_URL = "http://testnet-marketplace-backend.herokuapp.com";

export const PROVIDER = "https://ropsten.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161";