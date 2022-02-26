import React, { useState } from 'react';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import { ListItem, List, ListItemText, IconButton } from '@mui/material';
import DrawerStyles from './DrawerStyles';
import { Link } from 'react-router-dom';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';

export default function Drawer() {
  const [openDrawer, setopenDrawer] = useState(false);
  const [value, setvalue] = useState(0);
  const classes = DrawerStyles();

  const itemsArr = [
    { name: 'Profile', route: '/profile' },
    { name: 'Help & Feedback', route: '/about' },
    { name: 'Lock Wallet', route: '/products' },
    { name: 'Get Voter Role', route: '/roll' },
  ];
  return (
    <div>
      <SwipeableDrawer
        disableRipple
        open={openDrawer}
        onClose={() => setopenDrawer(false)}
        onOpen={() => setopenDrawer(true)}
        classes={{ paper: classes.drawer }}
      >
        <div className={classes.toolbarMarginDrawer} />
        <List disablePadding>
          {itemsArr.map((item, index) => (
            <ListItem
              divider
              button
              component={Link}
              to={item?.route}
              onClick={() => {
                setopenDrawer(false);
                setvalue(index);
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
