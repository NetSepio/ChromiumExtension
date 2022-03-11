import React from 'react';
import { Button, Grid, Typography } from '@mui/material';
import Rating from '@mui/material/Rating';

const Feedback = () => {
  const [value, setValue] = React.useState(2);
  return (
    <Grid container>
      <Grid
        item
        container
        alignItems="center"
        justifyContent="space-between"
        style={{ marginBottom: '1rem' }}
      >
        <label>How satisfied were you ?</label>
        <Rating
          name="simple-controlled"
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue);
          }}
        />
      </Grid>
      <Grid item container>
        <Grid item xs={12}>
          Write to us
        </Grid>
        <Grid item xs={12}>
          <textarea
            style={{
              width: '90%',
              backgroundColor: '#181818',
              color: '#fff',
              borderRadius: 8,
              resize: 'none',
              marginTop: 10,
              padding:10
            }}
            rows={10}
          />
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Typography align="center">
          <Button variant="contained">Submit</Button>
        </Typography>
      </Grid>
    </Grid>
  );
};

export default Feedback;
