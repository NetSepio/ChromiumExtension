import React, { useState } from 'react';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import {
  ListItem,
  List,
  ListItemText,
  IconButton,
  Typography,
  Grid,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DrawerStyles from './DrawerStyles';
import { Link } from 'react-router-dom';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import { useDispatch } from 'react-redux';
import { updateTab } from '../../redux/projects/projectSlice';

export default function Drawer() {
  const [openDrawer, setopenDrawer] = useState(false);
  const [value, setvalue] = useState(0);
  const dispatch = useDispatch();
  const classes = DrawerStyles();

  const itemsArr = [
    { name: 'Profile', route: '/profile' },
    { name: 'Help & Feedback', route: '/about' },
    { name: 'Lock Wallet', route: '/products' },
  ];
  const changeTab = (item) => {
    switch (item?.name) {
      case 'Profile':
        dispatch(updateTab({ data: 4 }));
        break;
      case 'Help & Feedback':
        dispatch(updateTab({ data: 5 }));
        break;
      case 'Lock Wallet':
        dispatch(updateTab({ data: 6 }));
        break;
      default:
        break;
    }
  };
  return (
    <div>
      <SwipeableDrawer
        disableRipple
        open={openDrawer}
        onClose={() => setopenDrawer(false)}
        onOpen={() => setopenDrawer(true)}
        classes={{ paper: classes.drawer }}
      >
        <Grid
          container
          justifyContent="space-between"
          alignItems="center"
          style={{ padding: 18 }}
        >
          <Grid item>
            <Typography className={classes.drawerText} sx={{ opacity: 1 }}>
              NetSepio
            </Typography>
          </Grid>
          <Grid item>
            <CloseIcon
              onClick={() => setopenDrawer(false)}
              sx={{ cursor: 'pointer' }}
            />
          </Grid>
        </Grid>
        <div className={classes.toolbarMarginDrawer} />
        <List disablePadding>
          {itemsArr.map((item, index) => (
            <ListItem
              divider
              button
              component={Link}
              // to={item?.route}
              onClick={() => {
                setopenDrawer(false);
                // setvalue(index);
                changeTab(item);
              }}
              className={classes.drawerText}
              selected={value === 0}
              classes={{ selected: classes.drawerItemSelected }}
            >
              <ListItemText disableTypography>{item.name}</ListItemText>
            </ListItem>
          ))}
        </List>
      </SwipeableDrawer>
      <IconButton
        className={classes.drawerIconContainer}
        onClick={() => setopenDrawer(!openDrawer)}
      >
        <MenuOutlinedIcon className={classes.drawerIcon} />
      </IconButton>
    </div>
  );
}
