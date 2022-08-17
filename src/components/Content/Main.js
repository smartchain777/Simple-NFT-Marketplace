import { useContext, useState  } from 'react';

import {
  Box,
  Grid,
} from '@mui/material' ;

import { makeStyles } from '@mui/styles' ;

import MintForm from './MintNFT/MintForm';
import NFTCollection from './NFTCollection/NFTCollection';
import CollectionContext from '../../store/collection-context';
import Spinner from '../Layout/Spinner';
import logo from '../../img/logo2.PNG'

const useStyles = makeStyles(() => ({
  root : {
    paddingLeft : 10,
    paddingRight : 10
  }
}))
const Main = () => {

  const classes = useStyles() ;

  const collectionCtx = useContext(CollectionContext);
  return(
    <Box className={classes.root} >
      <Grid container>
        <Grid item xs={12} sx={{textAlign : 'center'}}>
          <Box className="content mr-auto ml-auto">
            <Box component={'img'} src={logo} alt="logo" width={500} />
              {!collectionCtx.nftIsLoading && <MintForm />}
              {collectionCtx.nftIsLoading && <Spinner />}
          </Box>
        </Grid>
      </Grid>
      <hr/>
      {!collectionCtx.loadingNFT && <NFTCollection />}
      {collectionCtx.loadingNFT && <Spinner />}
    </Box>
  );
};

export default Main;