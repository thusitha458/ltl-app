import React, {Component} from 'react';
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import axios from 'axios';
import {BACKEND_URL} from "../config";
import {NotificationManager} from 'react-notifications';
import Cookies from 'js-cookie';
import Layout from "./Layout";

class AddProject extends Component {
    _isMounted = false;
    state = {
        ct: '',
        customerName: '',
        loading: false,
    };

    componentDidMount() {
        this._isMounted = true;
        this.props.onRouteChange();
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    handleAddProjectClick = () => {
        if (this.state.ct && this.state.customerName) {
            let token = Cookies.get('token');
            if (token) {
                this.setState({loading: true});
                axios.post(`${BACKEND_URL}/project`,
                    {ct: this.state.ct.trim(), customer: {name: this.state.customerName.trim()}},
                    {headers: {token: token}})
                    .then(response => {
                        if (this._isMounted) {
                            this.setState({loading: false});
                            this.props.history.push(`/project/${this.state.ct.trim()}`);
                        }
                    }).catch(error => {
                        NotificationManager.error('Request failed');
                        this.setState({loading: false, ct: '', customerName: ''});
                        if (error.response && error.response.status === 401) {
                            this.props.history.push('/login');
                        }
                    });
            } else {
                this.props.history.push('/login');
            }
        } else {
            NotificationManager.error('Missing CT and/or customer name');
        }
    };

    handleOnChangeCT = e => {
        if (/^[a-zA-Z0-9 _()]*$/.test(e.target.value)) {
            this.setState({ct: e.target.value});
        }
    };

    handleOnChangeCustomerName = e => {
        if (/^[a-zA-Z0-9 _(),./]*$/.test(e.target.value)) {
            this.setState({customerName: e.target.value});
        }
    };

    render() {
        return (
            <Layout {...this.props} title={"Add Project"}>
            <div className="AddProject">
                <div className="AddProjectContent">
                    <div className="description">Please enter project details.</div>
                    <FormControl className="formControl">

                        <TextField
                            className="formField"
                            id="ct"
                            label="CT"
                            variant="standard"
                            value={this.state.ct}
                            onChange={this.handleOnChangeCT}
                        />

                        <TextField
                            className="formField"
                            id="customer-name"
                            label="Customer Name"
                            variant="standard"
                            value={this.state.customerName}
                            onChange={this.handleOnChangeCustomerName}
                        />

                        <Button
                            className="addProjectButton"
                            variant="contained"
                            onClick={this.handleAddProjectClick}
                        >Add</Button>
                    </FormControl>
                </div>
            </div>
            </Layout>
        );
    }
}

export default AddProject;