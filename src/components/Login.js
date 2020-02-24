import React, {Component} from 'react';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import {NotificationManager} from "react-notifications";
import {BACKEND_URL} from "../config/config";
import axios from 'axios';
import {CircularProgress} from "@material-ui/core";
import Cookies from 'js-cookie';

class Login extends Component {
    _isMounted = false;
    state = {
        role: '',
        password: '',
        loading: false,
    };

    componentDidMount() {
        this._isMounted = true;
        this.props.onRouteChange();
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    handleLoginClick = () => {
        if (this.state.role && this.state.password) {
            this.setState({loading: true});
            axios.post(`${BACKEND_URL}/user/login`, {role: this.state.role, password: this.state.password})
                .then(response => {
                    if (this._isMounted && response && response.data) {
                        Cookies.set('token', response.data.token, {expires: response.data.tokenAgeMS});
                        Cookies.set('role', response.data.user.role, {expires: response.data.tokenAgeMS});
                        this.props.history.push('/');
                    }
                })
                .catch(error => {
                    NotificationManager.error('Request failed');
                    this.setState({role: '', password: ''});
                })
                .finally(() => {
                    if (this._isMounted) this.setState({loading: false});
                });
        } else {
            NotificationManager.error('Missing role and/or password');
        }
    };

    render() {
        return (
            <div className="LoginWrapper">
            <div className="Login">
                <div className="LoginContent">
                    <div className="description">Please enter your credentials.</div>
                    <FormControl className="formControl">
                        <InputLabel id="role-select-label">Role</InputLabel>
                        <Select
                            defaultValue={"none"}
                            labelId="role-select-label"
                            id="demo-simple-select"
                            className="formField"
                            value={this.state.role}
                            onChange={e => this.setState({role: e.target.value})}
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
                            type="password"
                            className="formField"
                            id="password"
                            label="Password"
                            variant="standard"
                            value={this.state.password}
                            onChange={e => this.setState({password: e.target.value})}
                            onKeyDown={e => e.key === 'Enter' && this.state.role && this.state.password
                                ? this.handleLoginClick() : undefined}
                        />

                        {
                            this.state.loading ?
                                <div className="logInSpinner">
                                    <CircularProgress color="primary" />
                                </div>
                                :
                                <Button
                                    className="formField loginButton"
                                    variant="contained"
                                    onClick={this.handleLoginClick}
                                >Login</Button>
                        }

                    </FormControl>
                </div>
            </div>
            </div>
        );
    }
}

export default Login;