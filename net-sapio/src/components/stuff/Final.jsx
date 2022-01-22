import React from 'react';
import { Grid,Typography,Button } from '@mui/material';
import commonStyles from '../../styles/commonStyles';
import { useHistory } from 'react-router-dom';

const Final = () => {
  const styles = commonStyles();
  const history=useHistory()
  return (
    <Grid container direction="column">
      <Grid item className={styles.item}>
        <Typography variant="h5" align="center" style={{ color: '#fff' }}>
          You are all done!
        </Typography>
      </Grid>
      <Grid item className={styles.item}>
        <Typography
          variant="body1"
          align="center"
          style={{ opacity: 0.5, color: '#fff' }}
        >
          Follow us on Twitter
        </Typography>
      </Grid>
      <Grid item className={styles.item} xs={12} style={{marginTop:'4rem'}}>
        <Button variant="contained" color="primary" style={{ width: '100%' }}
          onClick={()=>history.push('/dashboard')}
        >
          Finish
        </Button>
      </Grid>
    </Grid>
  );
};

export default Final;
