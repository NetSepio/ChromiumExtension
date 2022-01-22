import { Grid, Typography } from '@mui/material';
import React from 'react';
import TextArea from '../../common/textarea/TextArea';
import DashboardStyles from '../DashboardStyles';

const ShowMnem = ({ val }) => {
  const styles = DashboardStyles();
  return (
    <Grid container>
      <Grid
        item
        container
        direction="column"
        alignItems="center"
      >
        <Grid item className={styles.showMnemContainer}>
          <Grid item>
            <Typography align="center" variant="h5" color="InfoBackground">Your secret recovery phase</Typography>
          </Grid>
          <Grid item>
            <TextArea readOnly={true} name="showMnem" value={val} />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ShowMnem;

{
  /* <TextArea readOnly={true} name="showMnem" value={val} /> */
}
