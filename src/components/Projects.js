import React, {Component} from 'react';
import List from '@material-ui/core/List';
import axios from 'axios';
import {BACKEND_URL} from "../config/config";
import ProjectItem from "./ProjectItem";
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import {CircularProgress} from "@material-ui/core";
import {NotificationManager} from "react-notifications";
import Cookies from 'js-cookie';
import AlertDialog from "./AlertDialog";
import Layout from "./Layout";

class Projects extends Component {
    state = {
        projects: [],
        loading: false,
        showAlert: false,
        deleteItemCt: undefined,
    };
    _isMounted = false;

    componentDidMount() {
        this._isMounted = true;
        this.props.onRouteChange();

        let token = Cookies.get('token');
        if (token) {
            this.setState({loading: true});
            axios.get(`${BACKEND_URL}/project`, {headers: {token: token}}).then(response => {
                if (this._isMounted && response && response.data && response.data.projects) {
                    this.setState({
                        projects: response.data.projects || [],
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

    handleProjectClick = ct => {
        this.props.history.push(`/project/${ct}`);
    };

    handleAddProjectClick = () => {
        this.props.history.push('/addProject');
    };

    handleProjectEdit = ct => {
        this.props.history.push(`/edit/${ct}`);
    };

    handleDeleteClick = ct => {
        this.setState({showAlert: true, deleteItemCt: ct});
    };

    handleAlertOk = () => {
        let ct = this.state.deleteItemCt;
        this.setState({showAlert: false, deleteItemCt: undefined});
        let token = Cookies.get('token');
        if (token) {
            this.setState({loading: true});
            axios.delete(`${BACKEND_URL}/project/${ct}`, {headers: {token: token}}).then(() => {
                return axios.get(`${BACKEND_URL}/project`, {headers: {token: token}});
            }).then(response => {
                if (this._isMounted && response && response.data && response.data.projects) {
                    this.setState({
                        projects: response.data.projects || [],
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
    };

    handleAlertClose = () => {
        this.setState({showAlert: false, deleteItemCt: undefined});
    };

    render() {
        let role = Cookies.get('role');

        return (
            <Layout {...this.props} title="Projects" isHome={true}>
                <div className="ProjectsWrapper">
                    <div className="Projects">
                        {
                            this.state.loading ?
                                <CircularProgress color="primary" />
                                :
                                (
                                    <>
                                        <List>
                                            {
                                                this.state.projects.map((project, index) =>
                                                    <ProjectItem
                                                        key={project.ct}
                                                        onClickItem={() => this.handleProjectClick(project.ct)}
                                                        ct={project.ct}
                                                        customerName={project.customer && project.customer.name}
                                                        showDelete={role === 'ADMIN' || role === 'SPE'}
                                                        showEdit={role === 'ADMIN' || role === 'SPE'}
                                                        onClickDelete={() => this.handleDeleteClick(project.ct)}
                                                        onClickEdit={() => this.handleProjectEdit(project.ct)}
                                                        even={index % 2 !== 0}
                                                    />
                                                )
                                            }
                                        </List>
                                        <div className={`addProjectWrapper ${(!role || (role !== 'ADMIN' && role !== 'SPE')) && "hide-element"}`}>
                                            <Fab color="default" aria-label="add" onClick={this.handleAddProjectClick}>
                                                <AddIcon />
                                            </Fab>
                                        </div>
                                    </>
                                )
                        }

                        <AlertDialog
                            title={"Alert"}
                            message={"Are you sure you want to delete this project?"}
                            open={this.state.showAlert}
                            onClickOk={this.handleAlertOk}
                            onClickCancel={this.handleAlertClose}
                            onClose={this.handleAlertClose}
                        />
                </div>
            </div>
            </Layout>
        );
    }
}

export default Projects;