/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { Grid, Typography, Button } from '@mui/material';
import HomeStyles from '../styles/HomeStyles';
import Review from './Review.jsx';
import CustomChart from '../../components/chart/CustomChart.jsx';
import { styled } from '@mui/material/styles';
import LinearProgress, {
  linearProgressClasses,
} from '@mui/material/LinearProgress';
import { useQuery } from '@apollo/react-hooks';
import { FETCH_REVIEWS } from '../../graphql/Query/Query';
import Loader from '../../common/Loader';

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  minWidth: '10rem',
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor:
      theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: theme.palette.mode === 'light' ? '#1a90ff' : '#308fe8',
  },
}));

const Home = ({ dynamicURL, domain }) => {
  const classes = HomeStyles();
  const [val, setVal] = useState(0);
  const [color, setColor] = useState('')
  const [dataObject, setDataObject] = useState({});
  let siteURL = `${dynamicURL}`;

  const { loading, data } = useQuery(FETCH_REVIEWS, {
    variables: { siteURL },
  });

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
      setDataObject(obj);
    }
  }, [data]);

  const getRecommend = (data) => {
    let largest = 1;
    let obj = {};
    Object.keys(data).map((v) => {
      if (data[v] > largest) {
        largest = data[v];
      }
    });
    Object.keys(data)?.map((v) => {
      if (data[v] === largest) {
        obj = {
          [v]: data[v],
        };
      }
    });
    return obj;
  };

  const recommend = () => {
    try {
      return Object.keys(getRecommend(dataObject)).length > 0
        ? Object.keys(getRecommend(dataObject)).map((v) => {
          return `Sounds ${[v]}`
        })
        : '';
    } catch (error) {
      return '';
    }
  };

  // useEffect(()=>{
  //  let v= recommend()
  //  console.log(v[0],"vvvv")
  // },[dataObject])
  return (
    <Grid
      container
      justifyContent="center"
      // style={{paddingBottom:'3rem'}}
    >
      {loading && <Loader />}
      {val === 0 ? (
        <Grid item container direction="column" alignItems="center">
          <Grid item container justifyContent="center">
            <Grid item>
              <CustomChart reviews={data?.reviews} />
            </Grid>
          </Grid>
          <Grid
            item
            container
            direction="column"
            className={classes.flagContainer}
            alignItems="center"
          >
            <Grid item>
              <div className={classes.commonStatus}>
                <Typography color="#2c2d30">Genuine</Typography>{' '}
                <BorderLinearProgress
                  variant="determinate"
                  value={dataObject?.Genuine ? dataObject?.Genuine : 1}
                  className={classes.status}
                />
              </div>
              <div className={classes.commonStatus}>
                <Typography color="#2c2d30">Scam</Typography>{' '}
                <BorderLinearProgress
                  variant="determinate"
                  value={dataObject?.Scam ? dataObject?.Scam : 1}
                  className={classes.status}
                />
              </div>
              <div className={classes.commonStatus}>
                <Typography color="#2c2d30">Stereotype</Typography>{' '}
                <BorderLinearProgress
                  variant="determinate"
                  value={dataObject?.Stereotype ? dataObject?.Stereotype : 1}
                  className={classes.status}
                />
              </div>
              <div className={classes.commonStatus}>
                <Typography color="#2c2d30">Hate</Typography>{' '}
                <BorderLinearProgress
                  variant="determinate"
                  value={dataObject?.Hate ? dataObject?.Hate : 1}
                  className={classes.status}
                />
              </div>
              <div className={classes.commonStatus}>
                <Typography color="#2c2d30">Fake</Typography>{' '}
                <BorderLinearProgress
                  variant="determinate"
                  value={dataObject?.Fake ? dataObject?.Fake : 1}
                  className={classes.status}
                />
              </div>
            </Grid>
          </Grid>
          <Grid
            container
            direction="column"
            alignItems="center"
            style={{ backgroundColor: '#2c2d30' }}
          >
            <Typography
              variant="h5"
              component="span"
              style={{
                color:recommend()?.[0]==='Sounds Genuine'? '#3EDB3B':'red', 
                marginBottom: 10,
              }}
            >
              {recommend()}
            </Typography>
            <Grid item>
              <Button variant="contained" onClick={() => setVal(1)}>
                Submit Review
              </Button>
            </Grid>
          </Grid>
        </Grid>
      ) : (
        <Review
          goBack={() => setVal(0)}
          dynamicURL={dynamicURL}
          domain={domain}
        />
      )}
    </Grid>
  );
};

export default Home;
