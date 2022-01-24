import React, { useState } from 'react';
import { Button, Grid, Typography,Paper } from '@mui/material';
import Input from '../../common/Input/Input';
import DashboardStyles from '../DashboardStyles';
import TextArea from '../../common/textarea/TextArea';

const Review = () => {
  const styles=DashboardStyles()
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
    <Grid container direction="column" alignItems="flex-start" >
      <Grid item container justifyContent="center" alignItems="center" style={{minHeight:'60vh'}}>
        <Grid item className={styles.reviewContainer}>
          <Grid item style={{ marginBottom: '0.5rem' }}>
            <Typography align="center" variant="h5" className={styles.commonFont}>Write Review</Typography>
          </Grid>
          <Grid item style={{ marginBottom: '1rem' }}>
            <Input
              name="title"
              label="Title"
              placeholder="Short but informative title"
              value={title}
              onChange={onChange}
            />
          </Grid>
          <Grid item style={{ marginBottom: '1rem' }}>
            <TextArea
              name="description"
              rows="2"
              placeholder="Brief description of the website"
              label="Description"
              value={description}
              onChange={onChange}
            />
          </Grid>
          <Grid item>
            <Input
              name="url"
              label="Website URL"
              placeholder="https://example.com"
              value={url}
              onChange={onChange}
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
