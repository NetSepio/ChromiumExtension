import React, { useState } from 'react';
import { Button, Grid, Typography, Paper } from '@mui/material';
import Input from '../../common/Input/Input';
import DashboardStyles from '../DashboardStyles';
import TextArea from '../../common/textarea/TextArea';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const Review = ({ goBack }) => {
  const styles = DashboardStyles();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');

  const onChange = (e) => {
    switch (e.target.name) {
      case 'title':
        setTitle(e.target.valie);
        break;
      case 'description':
        setDescription(e.target.value);
      case 'url':
        setUrl(e.target.value);
      default:
        break;
    }
  };
  return (
    <Grid container direction="column" alignItems="flex-start">
      <Grid
        item
        container
        justifyContent="center"
        alignItems="center"
        className={styles.mainReviewContainer}
      >
        <Grid item className={styles.reviewContainer} >
          <Grid
            item
            container
            sm
            style={{ marginBottom: '0.5rem' }}
            alignItems="center"
          >
            <Grid item xs={4}>
                <ArrowBackIcon onClick={goBack}/>
            </Grid>
            <Grid item >
              <Typography
                variant="h5"
                className={styles.commonFont}
              >
                Write Review
              </Typography>
            </Grid>
          </Grid>
          <Grid item className={styles.commonItem}>
            <Input
              name="title"
              label="Title"
              placeholder="Short but informative title"
              value={title}
              onChange={onChange}
            />
          </Grid>
          <Grid item className={styles.commonItem}>
            <TextArea
              name="description"
              rows="2"
              placeholder="Brief description of the website"
              label="Description"
              value={description}
              onChange={onChange}
            />
          </Grid>
          <Grid item className={styles.commonItem}>
            <Input
              name="url"
              label="Website URL"
              placeholder="https://example.com"
              value={url}
              onChange={onChange}
            />
          </Grid>
          <Grid item className={styles.commonItem}>
            <Input
              name="category"
              label="Category"
              placeholder="Category"
              // value={url}
              // onChange={onChange}
            />
          </Grid>
          <Grid item className={styles.commonItem}>
            <Input
              name="tags"
              label="Tags"
              placeholder="Tags"
              // value={url}
              // onChange={onChange}
            />
          </Grid>
          <Grid item className={styles.commonItem}>
            <Input
              name="status"
              label="Status"
              placeholder="Status"
              // value={url}
              // onChange={onChange}
            />
          </Grid>
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
              <Button variant="outlined">Submit</Button>
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Review;
