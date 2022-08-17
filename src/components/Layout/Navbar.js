import { useContext, useState } from 'react';

import Web3Context from '../../store/web3-context';
import web3 from '../../connection/web3';

const Navbar = () => {
  const [fundsLoading, setFundsLoading] = useState(false);
  
  const web3Ctx = useContext(Web3Context);
  
  const connectWalletHandler = async() => {
    try {
      // Request account access
      await window.ethereum.request({ method: 'eth_requestAccounts' });
    } catch(error) {
      console.error(error);
    }

    // Load accounts
    web3Ctx.loadAccount(web3);
  };

  let etherscanUrl;

  if(web3Ctx.networkId === 3) {
    etherscanUrl = 'https://ropsten.etherscan.io'
  } else if(web3Ctx.networkId === 4) {
    etherscanUrl = 'https://rinkeby.etherscan.io'
  } else if(web3Ctx.networkId === 5) {
    etherscanUrl = 'https://goerli.etherscan.io'
  } else {
    etherscanUrl = 'https://etherscan.io'
  }
  
  return (
    <nav className="navbar navbar-expand-sm navbar-light bg-white p-2">      
      <ul className="navbar-nav ms-auto">
        <li className="nav-item">
          {web3Ctx.account && 
            <a 
              className="btn btn-info text-white" 
              href={`${etherscanUrl}/address/${web3Ctx.account}`}
              target="blank"
              rel="noopener noreferrer"
            >
              {web3Ctx.account.substr(0, 7)}...{web3Ctx.account.substr(web3Ctx.account.length-5)}
            </a>}
          {!web3Ctx.account && 
            <button 
              type="button" 
              className="btn btn-info text-white" 
              onClick={connectWalletHandler} 
            > 
              Connect your wallet
            </button>}
        </li>
      </ul>
    </nav>
  );  
};

export default Navbar;