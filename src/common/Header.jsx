import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Grid,
} from '@mui/material';
import styles from '../styles/commonStyles';
import Drawer from '../components/drawer/Drawer.jsx';
import { FETCH_REVIEWS } from '../graphql/Query/Query';
import { useQuery } from '@apollo/react-hooks';

const Header = ({ domain, dynamicURL }) => {
  const classes = styles();
  let siteURL = `${dynamicURL}`;
  const { loading, data } = useQuery(FETCH_REVIEWS, {
    variables: { siteURL },
  });
  const [dataObject, setDataObject] = useState({});
  const [totalReviews, setTotalReviews] = useState(0)

  const handleClick = () => {
    return <Drawer />;
  };

  useEffect(() => {
    if (data?.reviews?.length) {
      let tempArray = [];
      data?.reviews?.map((v) => {
        tempArray.push(v?.siteTag);
      });
      let obj = {};
      for (let char of tempArray) {
        !obj[char] ? (obj[char] = 1) : (obj[char] += 1);
      }
      let totalReviews=0
      for(let char of Object.keys(obj)){
        totalReviews+=obj[char]
      }
      let val = Math.round((obj.Genuine/totalReviews)*5)
      setTotalReviews(val)
      setDataObject(obj);
      // (6/16)*5
    }
  }, [data])
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed">
        <Toolbar style={{ minHeight: 50 }}>
          <Grid container alignItems="center" spacing={2}>
            <Grid item>
              <Drawer />
            </Grid>
            <Grid item container xs alignItems="center">
              <Grid item sm={11}>
                <Typography variant="h6">
                  {domain?.length > 23 ? `${domain?.slice(0, 23)}...` : domain}
                </Typography>
              </Grid>
              <Grid item container xs={1}>
                <Typography variant="body1" className={classes.ratings}>
                  {`${totalReviews}/5`}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      <div className style={{ marginBottom: '4.5rem' }} />
    </Box>
  );
};

export default Header;

// await walletMnemonic.signMessage("Hello World")
// // '0x14280e5885a19f60e536de50097e96e3738c7acae4e9e62d67272d794b8127d31c03d9cd59781d4ee31fb4e1b893bd9b020ec67dfa65cfb51e2bdadbb1de26d91c'

//  pass EULA +flow_id
