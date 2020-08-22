import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import HomeIcon from '@material-ui/icons/Home';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import Cookies from 'js-cookie';
import UpdatePasswordDialog from './UpdatePasswordDialog';
import SetUserPasswordDialog from './SetUserPasswordDialog';

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },
    accountOptions: {
        marginLeft: 'auto',
    },
    titleWrapper: {
        width: '100%',
    },
}));

export default function MenuAppBar (props) {
    const classes = useStyles();

    const [updatePasswordOpen, setUpdatePasswordOpen] = React.useState(false);
    const [overwritePasswordOpen, setOverwritePasswordOpen] = React.useState(false);

    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    const handleMenu = event => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleSignOutClick = () => {
        Cookies.remove('token');
        Cookies.remove('role');
        props.history.push('/login');
    };

    const handleUpdatePasswordClick = () => {
        if (!updatePasswordOpen) {
            setUpdatePasswordOpen(true);
        }
        setAnchorEl(null);
    };

    const handleUpdatePasswordClose = () => {
        setUpdatePasswordOpen(false);
    }

    const handleOverwritePasswordClick = () => {
        if (!updatePasswordOpen) {
            setOverwritePasswordOpen(true);
        }
        setAnchorEl(null);
    };

    const handleOverwritePasswordClose = () => {
        setOverwritePasswordOpen(false);
    }

    const handleHomeClick = () => {
        props.history.push('/');
    };

    return (
        <div className={classes.root} style={{opacity: 0.95}}>
            <AppBar position="static" color="default">
                <Toolbar>
                    <div>
                    {
                        !props.isHome &&
                        <IconButton onClick={handleHomeClick} edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
                            <HomeIcon />
                        </IconButton>
                    }
                    </div>
                    <div className={classes.titleWrapper}>
                        <div>
                            <Typography variant="h5" className={classes.title}>
                                {props.title || 'LTL (Pvt) Limited'}
                            </Typography>
                        </div>
                        <div>
                        {
                            props.items && props.items.length > 0 && 
                            <Typography variant="h10" className={classes.title}>
                                {props.items.join(', ')}
                            </Typography>
                        }
                        </div>
                    </div>
                    <div className={classes.accountOptions}>
                        <IconButton
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleMenu}
                            color="inherit"
                        >
                            <AccountCircle />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorEl}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={open}
                            onClose={handleClose}
                        >
                            <MenuItem onClick={handleUpdatePasswordClick}>Update My Password</MenuItem>
                            {Cookies.get('role') === 'ADMIN' && <MenuItem onClick={handleOverwritePasswordClick}>Set User Password</MenuItem>}
                            <MenuItem onClick={handleSignOutClick}>Sign Out</MenuItem>
                        </Menu>
                    </div>
                </Toolbar>
            </AppBar>
            <UpdatePasswordDialog 
                open={updatePasswordOpen}
                onClose={handleUpdatePasswordClose}
                history={props.history}
            />
            <SetUserPasswordDialog 
                open={overwritePasswordOpen}
                onClose={handleOverwritePasswordClose}
                history={props.history}
            />
        </div>
    );
}