/*global chrome*/
import React, { useState, useEffect } from 'react';
import { Button, Grid, Typography, Paper } from '@mui/material';
import Input from '../../common/Input/Input';
import DashboardStyles from '../DashboardStyles';
import TextArea from '../../common/textarea/TextArea';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { NFTStorage, File } from 'nft.storage';

const Review = ({ goBack }) => {
  const styles = DashboardStyles();
  const [review, setReview] = useState({
    title: '',
    description: '',
    url: window.location.href,
  });
  let [title, setTitle] = useState('');
  const [screenShot, setScreenShot] = useState('');

  //
  const apiKey = process.env.REACT_APP_API_URL;
  const client = new NFTStorage({ token: apiKey });

  const onChange = (e) => {
    switch (e.target.name) {
      case 'title':
        setReview({ ...review, title: e.target.value });
        break;
      case 'description':
        setReview({ ...review, description: e.target.value });
        break;
      case 'url':
        setReview({ ...review, url: e.target.value });
        break;
      default:
        break;
    }
  };

  const handleSubmitReview = async () => {
    const metadata = await client.store({
      ...review,
      name: `${review.title}s`,
      image: new File(
        [
          /* data */
        ],
        'pinpie.jpg',
        { type: 'image/jpg' }
      ),
    });
    console.log(metadata.url);
  };

  /* eslint-disable no-undef */
  useEffect(() => {
    async function onStartCapture() {}
    onStartCapture();
  }, []);

  useEffect(() => {
    console.log(screenShot, 'screenshot');
  }, [screenShot]);
  return (
    <Grid container direction="column" alignItems="flex-start">
      <Grid
        item
        container
        justifyContent="center"
        alignItems="center"
        className={styles.mainReviewContainer}
      >
        <Grid item className={styles.reviewContainer}>
          <Grid
            item
            container
            sm
            style={{ marginBottom: '0.5rem' }}
            alignItems="center"
          >
            <Grid item xs={4}>
              <ArrowBackIcon onClick={goBack} />
            </Grid>
            <Grid item>
              <Typography variant="h5" className={styles.commonFont}>
                Write Review
              </Typography>
            </Grid>
          </Grid>
          <Grid item className={styles.commonItem}>
            <Input
              name="title"
              label="Title"
              placeholder="Short but informative title"
              value={review.title}
              onChange={onChange}
            />
          </Grid>
          <Grid item className={styles.commonItem}>
            <TextArea
              name="description"
              rows="2"
              placeholder="Brief description of the website"
              label="Description"
              value={review.description}
              onChange={onChange}
            />
          </Grid>
          <Grid item className={styles.commonItem}>
            <Input
              name="url"
              label="Website URL"
              placeholder="https://example.com"
              value={review.url}
              onChange={onChange}
            />
          </Grid>
          {/* <Grid item className={styles.commonItem}>
            <Input
              name="status"
              label="Status"
              placeholder="Status"
              // value={url}
              // onChange={onChange}
            />
          </Grid> */}
          <Grid item className={styles.commonItem}>
            <Input
              name="screenShot"
              label="ScreenShot"
              placeholder="ScreenShot"
              // value={url}
              // onChange={onChange}
            />
          </Grid>
          <Grid item style={{ marginTop: '0.5rem' }}>
            <Typography align="center">
              {' '}
              <Button variant="outlined" onClick={handleSubmitReview}>
                Submit
              </Button>
            </Typography>
          </Grid>
          {/* <img src={screenShot}/> */}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Review;
