import React, { useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { BACKEND_URL } from '../config/config';
import axios from 'axios';
import Cookies from 'js-cookie';
import { NotificationManager } from 'react-notifications';
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const NewLogin = () => {
    const [role, setRole] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const classes = useStyles();
    const history = useHistory();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (role && password) {
            setLoading(true);
            axios.post(`${BACKEND_URL}/user/login`, {role, password})
                .then(response => {
                    if (response && response.data) {
                        Cookies.set('token', response.data.token, {expires: response.data.tokenAgeMS});
                        Cookies.set('role', response.data.user.role, {expires: response.data.tokenAgeMS});
                        history.push('/');
                    }
                })
                .catch(error => {
                    const errorMessage = error.response && error.response.data && error.response.data.error;
                    NotificationManager.error(errorMessage || 'Request failed');
                    setPassword('');
                })
                .finally(() => {
                    setLoading(false);
                });
        } else {
            NotificationManager.error('Missing role and/or password');
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                Sign in
                </Typography>
                <form className={classes.form} noValidate onSubmit={handleSubmit}>
                <Select
                        variant="outlined"
                        margin="normal"
                        defaultValue={"none"}
                        required
                        fullWidth
                        name="role"
                        autocomplete="username"
                        autoFocus
                        value={role}
                        onChange={e => setRole(e.target.value)}
                    >
                        <MenuItem value={"none"} disabled>Role</MenuItem>
                        <MenuItem value={"ADMIN"}>ADMIN</MenuItem>
                        <MenuItem value={"SPE"}>SPE</MenuItem>
                        <MenuItem value={"EE"}>EE</MenuItem>
                        <MenuItem value={"AM C&P"}>AM C&P</MenuItem>
                        <MenuItem value={"QA"}>QA</MenuItem>
                        <MenuItem value={"PE"}>PE</MenuItem>
                        <MenuItem value={"TE"}>TE</MenuItem>
                    </Select>
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    className={classes.submit}
                    disabled={loading}
                >
                    Sign In
                </Button>
                </form>
            </div>
        </Container>
    );
};

export default NewLogin;