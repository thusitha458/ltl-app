import React, {Component} from 'react';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import axios from 'axios';
import {BACKEND_URL} from '../config';
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import {NotificationManager} from "react-notifications";
import Cookies from 'js-cookie';
import {INNER_FIELD_TYPES} from "../config/constants";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import moment from "moment";
import Layout from "./Layout";

const StyledTableCell = withStyles(theme => ({
    head: {
        fontSize: 12,
        borderRight: '1px solid #cfcfcf',
    },
    body: {
        fontSize: 12,
        borderRight: '1px solid #cfcfcf',
    },
}))(TableCell);

const StyledTableRow = withStyles(theme => ({
    root: {
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.background.default,
        },
    },
}))(TableRow);

class ProjectActionPlan extends Component {
    _isMounted = false;
    state = {
        project: undefined,
        changed: false,
        loading: false,
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
                    this.setState({project: response.data.project});
                }
                if (this._isMounted) this.setState({loading: false});
            }).catch(error => {
                NotificationManager.error('Request failed');
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

    handleInnerFieldValueChange = (fieldId, innerFieldId, value) => {
        if (this.state.project && this.state.project.actionPlan) {
            let actionPlan = [...this.state.project.actionPlan];
            if (actionPlan[fieldId]) {
                if (actionPlan[fieldId].innerFields && actionPlan[fieldId].innerFields[innerFieldId]) {
                    actionPlan[fieldId].innerFields[innerFieldId].value = value;
                    actionPlan[fieldId].innerFields[innerFieldId].value = value;
                    this.setState({
                        project: {...this.state.project, actionPlan: actionPlan},
                        changed: true,
                    });
                }
            }
        }
    };

    handleSaveButtonClick = () => {
        if (this.state.changed && this.state.project && this.state.project.ct && this.state.project.actionPlan) {
            let token = Cookies.get('token');
            if (token) {
                this.setState({loading: true});
                axios.put(`${BACKEND_URL}/project/${this.state.project.ct}`,
                    {actionPlan: this.state.project.actionPlan},
                    {headers: {token: token}},
                    ).then(response => {
                        if (this._isMounted && response && response.data && response.data.project) {
                            this.setState({project: response.data.project});
                        }
                        if (this._isMounted) this.setState({loading: false});
                    }).catch(error => {
                        NotificationManager.error('Request failed');
                        this.setState({loading: false});
                        if (error.response && error.response.status === 401) {
                            this.props.history.push('/login');
                        }
                    });
            } else {
                this.props.history.push('/login');
            }
        }
    };

    render() {
        let role = Cookies.get('role');

        return (
            <Layout {...this.props} title={this.state.project && `${this.state.project.ct}: ${this.state.project.customer.name}`}>
                <div className="ProjectActionPlan">
                {
                    this.state.loading ?
                        <CircularProgress color="primary"/>
                        :
                        <TableContainer component={Paper}>
                            <Table className="table" aria-label="customized table">
                                <colgroup>
                                    <col style={{width:'30%'}}/>
                                    <col style={{width:'5%'}}/>
                                    <col style={{width:'10%'}}/>
                                    <col style={{width:'10%'}}/>
                                    <col style={{width:'5%'}}/>
                                    <col style={{width:'10%'}}/>
                                    <col style={{width:'20%'}}/>
                                </colgroup>
                                <TableHead>
                                    <TableRow>
                                        <StyledTableCell>Activity</StyledTableCell>
                                        <StyledTableCell align="right">Responsibility</StyledTableCell>
                                        <StyledTableCell align="right">Target date</StyledTableCell>
                                        <StyledTableCell align="right">Target date(Rev.)</StyledTableCell>
                                        <StyledTableCell align="right">Status</StyledTableCell>
                                        <StyledTableCell align="right">Date completed</StyledTableCell>
                                        <StyledTableCell align="right">Remarks</StyledTableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {this.state.project && this.state.project.actionPlan
                                        .sort((a, b) => a.id - b.id)
                                        .map(field => {
                                            return (
                                                <StyledTableRow key={field.id}>
                                                    {
                                                        field.innerFields && field.innerFields
                                                            .sort((a, b) => a.id - b.id)
                                                            .map(innerField => {
                                                                let tableCellProps = innerField.id === 0 ? {component: "th", scope: "row"} : {align: "right"};
                                                                let userCanEdit = innerField.editableRoles.findIndex(editableRole => editableRole === role) !== -1;
                                                                if (innerField.editable && userCanEdit && role) {
                                                                    if (innerField.type === INNER_FIELD_TYPES.ENUM) {
                                                                        let validEnumValues = [...innerField.enum];
                                                                        if (role !== 'ADMIN' && innerField.value) {
                                                                            let found = false;
                                                                            validEnumValues = validEnumValues.filter(enumValue => {
                                                                                if (enumValue === innerField.value) {
                                                                                    found = true;
                                                                                    return true;
                                                                                }
                                                                                return found;
                                                                            });
                                                                        }
                                                                        return (
                                                                            <StyledTableCell {...tableCellProps} key={innerField.id}>
                                                                                <Select
                                                                                    // labelId="role-select-label"
                                                                                    // id="demo-simple-select"
                                                                                    // className="formField"
                                                                                    defaultValue="none"
                                                                                    value={this.state.project.actionPlan[field.id].innerFields[innerField.id].value}
                                                                                    onChange={e => {this.handleInnerFieldValueChange(field.id, innerField.id, e.target.value)}}
                                                                                >
                                                                                    <MenuItem value={"none"} disabled>Select a value</MenuItem>
                                                                                    {
                                                                                        validEnumValues.map(enumValue => <MenuItem key={enumValue} value={enumValue}>{enumValue}</MenuItem>)
                                                                                    }
                                                                                </Select>
                                                                            </StyledTableCell>
                                                                        );
                                                                    } else {
                                                                        return (
                                                                            <StyledTableCell {...tableCellProps} key={innerField.id}>
                                                                                <TextField
                                                                                    // id="date"
                                                                                    // label="Birthday"
                                                                                    size='small'
                                                                                    type={innerField.type === INNER_FIELD_TYPES.DATE ? "date" : undefined}
                                                                                    value={this.state.project.actionPlan[field.id].innerFields[innerField.id].value}
                                                                                    onChange={e => {this.handleInnerFieldValueChange(field.id, innerField.id, e.target.value)}}
                                                                                    // className="textField"
                                                                                    inputProps={innerField.type === INNER_FIELD_TYPES.DATE && role !== 'ADMIN' ? {
                                                                                        min: moment().utcOffset('+0530').format('YYYY-MM-DD'),
                                                                                    } : undefined}
                                                                                />
                                                                            </StyledTableCell>
                                                                        );
                                                                    }
                                                                } else {
                                                                    return (
                                                                        <StyledTableCell {...tableCellProps} key={innerField.id}>
                                                                            {innerField.editable ? innerField.value : innerField.defaultValue}
                                                                        </StyledTableCell>
                                                                    );
                                                                }
                                                            })
                                                    }
                                                </StyledTableRow>
                                            );
                                        })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                }
                <div className="footer">
                    <Button
                        className="saveButton"
                        variant="contained"
                        onClick={this.handleSaveButtonClick}
                        disabled={!this.state.changed}
                        color="primary"
                    >Save</Button>
                </div>
            </div>
            </Layout>
        );
    }
}

export default ProjectActionPlan;
// export default withLayout(props => props.match && props.match.params && props.match.params.ct)(ProjectActionPlan);