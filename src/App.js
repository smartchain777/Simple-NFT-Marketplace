import React, { useContext, useEffect } from 'react';

import web3 from './connection/web3';
import Navbar from './components/Layout/Navbar';
import Main from './components/Content/Main';
import Web3Context from './store/web3-context';
import CollectionContext from './store/collection-context';
import NFTCollection from './abis/NFTCollection.json';

const App = () => {
  const web3Ctx = useContext(Web3Context);
  const collectionCtx = useContext(CollectionContext);
  
  useEffect(() => {
    // Check if the user has Metamask active
    if(!web3) {
      alert('Non-Ethereum browser detected. You should consider trying MetaMask!');
      return;
    };
    
    // Function to fetch all the blockchain data
    const loadBlockchainData = async() => {
      // Request accounts acccess if needed
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });  
      } catch(error) {
        console.error(error);
      }
      
      // Load account
      const account = await web3Ctx.loadAccount(web3);

      // Load Network ID
      const networkId = await web3Ctx.loadNetworkId(web3);

      // Load Contracts      
      const nftDeployedNetwork = NFTCollection.networks[networkId];
      const nftContract = collectionCtx.loadContract(web3, NFTCollection, nftDeployedNetwork);

      if(nftContract) {
        // Load total Supply
        const totalSupply = await collectionCtx.loadTotalSupply(nftContract);
        // alert(totalSupply);
        // Load Collection
        collectionCtx.loadCollection(nftContract, totalSupply);       

        // Event subscription
        nftContract.events.Transfer()
        .on('data', (event) => {
          collectionCtx.updateCollection(nftContract, event.returnValues.tokenId, event.returnValues.to);
          collectionCtx.setNftIsLoading(false);
        })
        .on('error', (error) => {
          console.log(error);
        });
        
      } else {
        alert('NFTCollection contract not deployed to detected network.')
      }

      collectionCtx.setNftIsLoading(false);

      // Metamask Event Subscription - Account changed
      window.ethereum.on('accountsChanged', (accounts) => {
        web3Ctx.loadAccount(web3);
      });

      // Metamask Event Subscription - Network changed
      window.ethereum.on('chainChanged', (chainId) => {
        window.location.reload();
      });
    };
    
    loadBlockchainData();
  }, []);

  const showNavbar = web3 && collectionCtx.contract;
  const showContent = web3 && collectionCtx.contract && web3Ctx.account;
  
  return(
    <React.Fragment>
      {showNavbar && <Navbar />}
      {showContent && <Main />}
    </React.Fragment>
  );
};

export default App;