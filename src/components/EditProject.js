import React, {Component} from 'react';
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import IconButton from '@material-ui/core/IconButton';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import Chip from '@material-ui/core/Chip';
import axios from 'axios';
import {BACKEND_URL} from "../config/config";
import {NotificationManager} from 'react-notifications';
import Cookies from 'js-cookie';
import Layout from "./Layout";
import {CircularProgress} from "@material-ui/core";

class EditProject extends Component {
    _isMounted = false;
    state = {
        project: undefined,
        customerName: '',
        itemDescription: '',
        items: [],
        loading: false,
        ct: '',
    };

    componentDidMount() {
        this._isMounted = true;
        this.props.onRouteChange();
        let ct = this.props.match && this.props.match.params && this.props.match.params.ct;
        
        let token = Cookies.get('token');
        if (token) {
            this.setState({loading: true});
            axios.get(`${BACKEND_URL}/project/${ct}`,{headers: {token: token}}).then(response => {
                if (this._isMounted && response && response.data && response.data.project) {
                    this.setState({
                        project: response.data.project,
                        customerName: response.data.project.customer && response.data.project.customer.name,
                        items: response.data.project.items || [],
                        ct: response.data.project.ct,
                    });
                }
                if (this._isMounted) this.setState({loading: false});
            }).catch(error => {
                const errorMessage = error.response && error.response.data && error.response.data.error;
                NotificationManager.error(errorMessage || 'Request failed');
                this.setState({loading: false});
                if (error.response && error.response.status === 401) {
                    this.props.history.push('/login');
                }
            });
        } else {
            this.props.history.push('/login');
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    handleOnChangeCT = e => {
        if (/^[a-zA-Z0-9_()]*$/.test(e.target.value)) {
            this.setState({ct: e.target.value});
        }
    };

    handleEditProjectClick = () => {
        let ct = this.props.match && this.props.match.params && this.props.match.params.ct;
        if (ct && this.state.ct && this.state.customerName) {
            let token = Cookies.get('token');
            if (token) {
                this.setState({loading: true});
                axios.put(`${BACKEND_URL}/project/${ct}`,
                    {
                        customer: {name: this.state.customerName.trim()},
                        items: this.state.items || [],
                        ct: this.state.ct,
                    },
                    {headers: {token: token}})
                    .then(response => {
                        if (this._isMounted) {
                            this.setState({loading: false});
                            this.props.history.push('/');
                        }
                    }).catch(error => {
                        const errorMessage = error.response && error.response.data && error.response.data.error;
                        NotificationManager.error(errorMessage || 'Request failed');
                        this.setState({loading: false, ct: '', customerName: ''});
                        if (error.response && error.response.status === 401) {
                            this.props.history.push('/login');
                        } else {
                            this.props.history.push('/');
                        }
                    });
            } else {
                this.props.history.push('/login');
            }
        } else {
            NotificationManager.error('Missing CT and/or customer name');
        }
    };

    handleOnChangeCustomerName = e => {
        if (/^[a-zA-Z0-9 _(),./]*$/.test(e.target.value)) {
            this.setState({customerName: e.target.value});
        }
    };

    handleOnChangeItemDescription = e => {
        this.setState({itemDescription: e.target.value});
    };

    handleAddItem = () => {
        if (this.state.itemDescription && this.state.itemDescription.trim()) {
            this.setState({
                itemDescription: '',
                items: [...this.state.items, this.state.itemDescription.trim()],
            });
        }
    };

    handleDeleteItem = (indexToDelete) => {
        this.setState({
            items: this.state.items.filter((item, index) => index !== indexToDelete),
        });
    };

    render() {
        let role = Cookies.get('role');
        if (role !== 'ADMIN' && role !== 'SPE') {
            this.props.history.push('/');
        }

        let ct = this.props.match && this.props.match.params && this.props.match.params.ct;

        return (
            <Layout {...this.props} title={`Update: ${ct}`}>
            <div className="AddProject">
                <div className="AddProjectContent">
                    {
                        this.state.loading &&
                        <CircularProgress color="primary" />
                    }
                    {
                        !this.state.loading &&
                        (
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

                                <div 
                                    className="formField" 
                                    style={{ display: 'flex', justifyContent: 'center' }}
                                >
                                    <TextField
                                        className="formField"
                                        id="item-description"
                                        label="Item Description"
                                        variant="standard"
                                        value={this.state.itemDescription}
                                        onChange={this.handleOnChangeItemDescription}
                                        style={{ width: '100%'}}
                                    />
                                    <IconButton 
                                        className="formField" 
                                        variant="standard"
                                        onClick={this.handleAddItem}
                                        disabled={!this.state.itemDescription}
                                    >
                                        <AddCircleOutlineIcon />
                                    </IconButton>
                                </div>

                                <div 
                                    className="formField"
                                >
                                    {
                                        this.state.items.map((item, index) => {
                                            return (
                                                <ItemChip 
                                                    key={new Date().toISOString() + index}
                                                    label={item}
                                                    onDelete={() => this.handleDeleteItem(index)}
                                                />
                                            );
                                        })
                                    }
                                </div>
                                
                                <Button
                                    className="addProjectButton"
                                    variant="contained"
                                    onClick={this.handleEditProjectClick}
                                >Update</Button>
                            </FormControl>
                        )
                    }
                </div>
            </div>
            </Layout>
        );
    }
}

export default EditProject;

const ItemChip = (props) => {
    let updatedLabel = props.label;
    if (props.label && props.label.length > 30) {
        updatedLabel = props.label.substring(0, 27) + '...';
    }
    return (
        <div style={{padding: 5}}>
            <Chip
                variant="outlined"
                label={updatedLabel}
                onDelete={props.onDelete}
            />
        </div>
    );
};