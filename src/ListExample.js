import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import ImageIcon from '@material-ui/icons/Image';
import WorkIcon from '@material-ui/icons/Work';
import BeachAccessIcon from '@material-ui/icons/BeachAccess';
import { getThemeProps } from '@material-ui/styles';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
    marginLeft: 'auto',
    marginRight: 'auto',
    // marginTop: '100px',
  },
}));

export default function ListExample(props) {
  const classes = useStyles();

  return (
    <List className={classes.root}>
      <ListItem button divider onClick={props.onClickItem}>
        <ListItemAvatar>
          <Avatar>
            <ImageIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary="CT 2001" secondary="Laugfs Power PLC" />
      </ListItem>
      <ListItem button divider onClick={props.onClickItem}>
        <ListItemAvatar>
          <Avatar>
            <WorkIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary="CT 2003" secondary="Omegagaline (Pvt) Ltd" />
      </ListItem>
      <ListItem button divider onClick={props.onClickItem}>
        <ListItemAvatar>
          <Avatar>
            <BeachAccessIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary="CT 2004" secondary="Mahawa Solar" />
      </ListItem>
    </List>
  );
}