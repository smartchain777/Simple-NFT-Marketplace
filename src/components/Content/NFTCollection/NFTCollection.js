import { useContext, useRef, createRef, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes, { symbol } from "prop-types";

import web3 from '../../../connection/web3';
import Web3Context from '../../../store/web3-context';
import CollectionContext from '../../../store/collection-context';
import { formatPrice, toFixed } from '../../../helpers/utils';
import fox from '../../../img/fox.ico';
import FOXTOKEN from '../../../abis/FOXTOKEN.json';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Badge from '@mui/material/Badge';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { ethers } from 'ethers';
import { NftSwapV4 } from '@traderxyz/nft-swap-sdk';
import Spinner from '../../Layout/Spinner';

import swal from 'sweetalert' ;

import {
  Dialog, DialogContent, DialogTitle, Divider, Grid
} from '@mui/material' ;

import { makeStyles } from '@mui/styles';

import {
  AddOrder,
  RunOrder
} from '../../../redux/actions/order';

import {
  AddOffer,
  RemoveOffer
} from '../../../redux/actions/offer';

import { PROVIDER, injected, HOST_URL } from '../../../constant';

import { useWeb3React } from '@web3-react/core';

import socketIOClient from 'socket.io-client';

import { getTokensBalance } from '@mycrypto/eth-scan';
import { useMediaQuery } from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 800,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  textAlign: 'center'
};

const useStyles = makeStyles(() => ({
  root : {
  },
  drawPaper : {
    border : '1px solid red !important'
  },
  card : {
    border :'1px solid lightgray',
    borderRadius : 5,
    padding : '20px !important',
    height : '100%'
  }

}))
const NFTCollection = () => {

  const web3Ctx = useContext(Web3Context);
  const collectionCtx = useContext(CollectionContext);

  const classes = useStyles() ;

  const match1650 = useMediaQuery('(min-width: 1650px)') ;
  const match1250 = useMediaQuery('(min-width: 1250px)') ;
  const match950 = useMediaQuery('(min-width: 950px)') ;
  const match550 = useMediaQuery('(min-width : 550px)') ;
  const match645 = useMediaQuery('(min-width : 645px)');

  const [orders, setOrders] = useState([]);
  const [offers, setOffers] = useState([]);
  const [sokectId, setSocketId] = useState();
  const socketRef = useRef();

  const [acceptLoading, setAcceptLoading] = useState(false);
  const [acceptLoadingBuyer, setAcceptLoadingBuyer] = useState("");

  const [buyLoading, setBuyLoading] = useState(false);
  const [buyLoadingNFT, setBuyLoadingNFT] = useState(-1);
  const [buyLoadingUser, setBuyLoadingUser] = useState("");

  const handleSocketId = (data) => {
    setSocketId(data);
  }
  
  useEffect(() => {
    socketRef.current = socketIOClient.connect(HOST_URL) ;
  
    socketRef.current.on('getId', data => { 
        handleSocketId(data)
    })
    
    const msg = {
        greeter : "Hello" ,
        content: "I Need Data.", 
        id: sokectId
    }

    socketRef.current.emit('sendClientMsg', msg);

    socketRef.current.on('sendOrderDataServer', dataGot => {
        setOrders(dataGot);
    })

    socketRef.current.on('sendOfferDataServer', dataGot => {
        setOffers(dataGot);
    })

    return () => {
        socketRef.current.disconnect();
    };
  }, []);

  const [open, setOpen] = useState(false);
  const [nftKey, setNFTKey] = useState(-1);
  const [offerIndex, setOfferIndex] = useState(-1);
  const handleOpen = (key, index) =>  {
    if(index !== -1) {
      if(offers[index].maker_addr === web3Ctx.account) {
        setOpen(true);
        setNFTKey(key);
        setOfferIndex(index);
      }
    }
  }
  const handleClose = () => setOpen(false);

  const currentOrder = nftKey !== -1 ? orders.filter(order => order.nft_id === collectionCtx.collection[nftKey].id) : [];

  const priceRefs = useRef([]);
  if (priceRefs.current.length !== collectionCtx.collection.length) {
    priceRefs.current = Array(collectionCtx.collection.length).fill().map((_, i) => priceRefs.current[i] || createRef());
  }
  
  const makeOfferHandler = async (event, id, key) => {
    event.preventDefault();
    
    const offer = {
      nft_id : id,
      maker_addr : web3Ctx.account,
      price : priceRefs.current[key].current.value
    };
    
    AddOffer(offer);
  };
  
  const buyHandler = async (event) => {
    const index = event.target.value;
    const buyIndex = parseInt(offers.findIndex(offer => offer.nft_id === collectionCtx.collection[index].id));

    setBuyLoading(true);
    setBuyLoadingNFT(collectionCtx.collection[index].id);
    setBuyLoadingUser(web3Ctx.account);

    try {
      const price = web3.utils.toWei(offers[buyIndex].price.toString(), 'ether');
      
      const networkId = await web3.eth.net.getId();

      const FOX = new web3.eth.Contract(FOXTOKEN.abi, FOXTOKEN.networks[networkId].address);

      let tokenBalances = [] ;
        
      await getTokensBalance(web3, web3Ctx.account, [FOXTOKEN.networks[networkId].address])
      .then( (balances) => {
        tokenBalances = balances ;
      })
      if(tokenBalances[FOXTOKEN.networks[networkId].address] < price) {
        const isOk = await swal({
          title: "Are you sure?",
          text: "You have not enough FOX Token for buy this NFT.\n Do you want mint 100000000 FOX Tokens?",
          icon: "warning",
          buttons: [
            'No, I am not sure!',
            'Yes, I am sure!'
          ],
        }) ;
        if(isOk){
          await FOX.methods.mint(web3Ctx.account, web3.utils.toWei("100000000", 'ether')).send({ from: web3Ctx.account });
        } else {
          return ;
        }
      }

      const provider = new ethers.providers.Web3Provider(web3.currentProvider);
      const signer = provider.getSigner();

      const nftSwapSdk = new NftSwapV4(provider, signer, networkId);

      const AZUKI_ERC721 = {
        tokenAddress: collectionCtx.contract.options.address,
        tokenId: collectionCtx.collection[index].id, // Token Id of the CryptoPunk we want to swap
        type: 'ERC721', // Must be one of 'ERC20', 'ERC721', or 'ERC1155'
      };

      const FOX_ERC20 = {
        tokenAddress: FOXTOKEN.networks[networkId].address,
        amount: price,
        type: 'ERC20',
      };

      const approvalStatusForUserB = await nftSwapSdk.loadApprovalStatus(
        FOX_ERC20,
        web3Ctx.account
      );
      if (!approvalStatusForUserB.contractApproved) {
        const approvalTx = await nftSwapSdk.approveTokenOrNftByAsset(
          FOX_ERC20,
          web3Ctx.account
        );
        const approvalTxReceipt = await approvalTx.wait();
      }
      
      const order = nftSwapSdk.buildNftAndErc20Order(
        AZUKI_ERC721,
        FOX_ERC20,
        'buy',
        web3Ctx.account
      );
      // Sign the order (User A signs since they are initiating the trade)
      const signedOrder = await nftSwapSdk.signOrder(order);
      await nftSwapSdk.postOrder(signedOrder, networkId);

      const order_d = {
        nft_id : collectionCtx.collection[index].id,
        user_addr : web3Ctx.account,
        nonce : signedOrder.nonce
      };
      AddOrder(order_d);
      setBuyLoading(false);
    } catch(exception) {
      setBuyLoading(false);
    }
  }
  
  const acceptHandler = async (index) => {
    const buyIndex = parseInt(offerIndex);

    setAcceptLoading(true);
    setAcceptLoadingBuyer(currentOrder[index].user_addr);

    try {
      const networkId = await web3.eth.net.getId();
      
      const provider = new ethers.providers.Web3Provider(web3.currentProvider);
      const signer = provider.getSigner();

      const nftSwapSdk = new NftSwapV4(provider, signer, networkId);

      const orders = await nftSwapSdk.getOrders({
        nonce: currentOrder[index].nonce,
      });
      const signedOrder = orders.orders[0].order;

      const fillTx = await nftSwapSdk.fillBuyNftOrderWithoutApproval(signedOrder, collectionCtx.collection[nftKey].id.toString());
      const fillTxReceipt = await nftSwapSdk.awaitTransactionHash(fillTx.hash);

      setNFTKey(-1);
      setOfferIndex(-1);
      RemoveOffer(offers[buyIndex]._id);
      RunOrder({nft_id: currentOrder[index].nft_id});
      setAcceptLoading(false);
    } catch(exception) {
      setAcceptLoading(false);
    }
    // await collectionCtx.updateCollection(collectionCtx.contract, offers[buyIndex].nft_id, web3Ctx.account);
  };

  const cancelHandler = async (event) => {
    setNFTKey(-1);
    setOfferIndex(-1);
    RemoveOffer(offers[event.target.value]._id);
    RunOrder({nft_id: offers[event.target.value].nft_id});
  };
  
  return(
    <Box className={classes.root}>
    <Grid container spacing={2} >
      {
        collectionCtx.collection.map((NFT, key) => {
          const index = offers ? offers.findIndex(offer => offer.nft_id === NFT.id) : -1;
          const owner = index === -1 ? NFT.owner : offers[index].maker_addr;
          const price = index !== -1 ? offers[index].price : null;

          return(
            <Grid  item xs={match1650 ? 2 : match1250 ? 3 : match950 ? 4 : match550 ? 6 : 12} key={key}>
              <Box className={classes.card}>
              <Box sx={{textAlign : 'right', display: 'flex', justifyContent : 'space-between', height:20}}>
                {owner === web3Ctx.account && <EmojiEventsIcon sx={{fill : 'gold'}}/>}
                <Badge badgeContent={owner === web3Ctx.account ? index !== -1 ? orders.length > 0 ? orders.filter(order => order.nft_id === NFT.id).length : 0 : 0 : 0} color="info" sx={{mt: 1, mr: 1}} >
                </Badge>
              </Box>
              <Box sx={{textAlign : 'center', fontSize : 25}}>
                    {NFT.title}
              </Box>
              <Box sx={{textAlign : 'center', height : 200}}>
                <Box component={'img'} onClick={(e) => handleOpen(key, index)} src={`https://ipfs.infura.io/ipfs/${NFT.img}`}  width={200} height={200} alt={`NFT ${key}`} />                         
              </Box>
              <Box sx={{mb : 1 , mt : 1, textAlign : 'center'}}>{`${owner.substr(0,7)}...${owner.substr(owner.length - 7)}`}</Box>
              
              {index !== -1 ?
                owner !== web3Ctx.account ?
                  <div className='row'>
                    <div className="d-grid gap-2 col-5 mx-auto">
                      <button onClick={buyHandler} value={key} className="btn btn-success" disabled={(buyLoading && buyLoadingNFT === NFT.id && buyLoadingUser === web3Ctx.account) || (orders.filter(order => order.user_addr === web3Ctx.account && order.nft_id === NFT.id).length !== 0 ? true : false)}>
                        {(buyLoading && buyLoadingNFT === NFT.id && buyLoadingUser === web3Ctx.account) ? <Spinner/> :'BUY'}
                      </button>
                    </div>
                    <div className="col-7 d-flex justify-content-end">
                      <img src={fox} width="25" height="25" className="align-center float-start" alt="price icon"></img>                
                      <p className="text-start"><b>{`${price}`}</b></p>
                    </div>
                  </div> :
                  <div className='row'>
                    <div className="d-grid gap-2 col-5 mx-auto">
                      <button onClick={cancelHandler} value={index} className="btn btn-danger">CANCEL</button>
                    </div>
                    <div className="col-7 d-flex justify-content-end">
                      <img src={fox} width="25" height="25" className="align-center float-start" alt="price icon"></img>                
                      <p className="text-start"><b>{`${price}`}</b></p>
                    </div>
                  </div> :
                owner === web3Ctx.account ?              
                  <form className="row g-2" onSubmit={(e) => makeOfferHandler(e, NFT.id, key)}>                
                    <div className="col-5 d-grid gap-2">
                      <button type="submit" className="btn btn-secondary">OFFER</button>
                    </div>
                    <div className="col-7">
                      <input
                        type="number"
                        step="1"
                        placeholder="Price..."
                        className="form-control"
                        ref={priceRefs.current[key]}
                      />
                    </div>                                  
                  </form> :
                  <p><br/></p>}
                </Box>
            </Grid>
          );
        })
      }
      
    </Grid>
    {
      nftKey !== -1 && offerIndex!== -1 ?
        <Dialog
          open={open}
          onClose={handleClose}
          fullWidth={true}
          maxWidth={true}
        >
          <DialogTitle>
            Order List
          </DialogTitle>
          <Divider />
          <DialogContent>
            <Grid container >
              <Grid item xs={match950 ? 4 : 12} sx={{border : '1px solid lightgray', borderRadius : 1 , p : 2, }}>
                <Typography id="modal-modal-title" variant="h6" component="h2" sx={{textAlign : 'center'}}>
                  {collectionCtx.collection[nftKey].title}
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 2, textAlign : 'center'}}>
                  <Box sx={{textAlign : 'center'}}>
                    <img src={`https://ipfs.infura.io/ipfs/${collectionCtx.collection[nftKey].img}`} className="card-img-bottom" style={{height: 300, width:300}} alt={`NFT ${nftKey}`} /> 
                  </Box>
                  <Box sx={{mt : 1}}>
                    {`Owner : ${offers[offerIndex].maker_addr.substr(0,7)}...${offers[offerIndex].maker_addr.substr(offers[offerIndex].maker_addr.length - 7)}`}
                  </Box>
                </Typography>
              </Grid>
              <Grid item xs={match950 ? 8 : 12} sx={{border : '1px solid lightgray', borderRadius : 1, p: 2 ,}}>
                <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                  {currentOrder.map((order, index) => (
                    <Box key={index}>
                      <ListItem
                        disableGutters
                        secondaryAction={
                          <Button variant='contained' onClick={(e) => acceptHandler(index)} sx={{width:100}} disabled={acceptLoading}>
                            {acceptLoading && order.user_addr === acceptLoadingBuyer?<Spinner/>:'Accept'}
                          </Button>
                        }
                      >
                        <ListItemText primary={`Buyer : ${order.user_addr.substr(0,7)}...${order.user_addr.substr(order.user_addr.length - 8, order.user_addr.length)}`} />
                      </ListItem>
                      <Divider />
                    </Box>
                    
                  ))}
                </List>
              </Grid>
            </Grid>
            </DialogContent>
        </Dialog>
        : <></>
    }
    </Box>
  );
};


export default NFTCollection;