import React, {Component} from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import axios from 'axios';
import {BACKEND_URL} from './config';

const StyledTableCell = withStyles(theme => ({
  head: {
    // backgroundColor: theme.palette.common.black,
    // color: theme.palette.common.white,
    // textAlign: 'center',
  },
  body: {
    fontSize: 14,
    // textAlign: 'center',
  },
}))(TableCell);

const StyledTableRow = withStyles(theme => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.background.default,
    },
  },
}))(TableRow);

let styles = {
  table: {
    // minWidth: 700,
    // width: 700,
  },
  root: {
    marginTop: 100,
    minWidth: 700,
    maxWidth: 1200,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  textField: {

  },
};

class CustomizedTables extends Component {
  state = {
    project: undefined,
  };

  componentDidMount() {
    axios.get(`${BACKEND_URL}/project`).then(response => {
      console.log(response);
      if (response && response.data && response.data.projects && response.data.projects.length > 0) {
        this.setState({project: response.data.projects[0]});
      }
    }).catch(console.error);
  }

  render() {
    const {classes} = this.props;

    console.log(this.state.project && this.state.project.actionPlan);

    return (
      <TableContainer className={classes.root} component={Paper}>
        <Table className={classes.table} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Activity</StyledTableCell>
              <StyledTableCell align="right">Responsibility</StyledTableCell>
              <StyledTableCell align="right">Target Date</StyledTableCell>
              <StyledTableCell align="right">Date Completed</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {this.state.project && this.state.project.actionPlan.map(field => {
              return (
                <StyledTableRow key={field.id}>
                {
                  field.innerFields && field.innerFields.map(innerField => {
                    let tableCellProps = innerField.id === 0 ? {component: "th", scope: "row"} : {align: "right"};
                    if (innerField.editable) {
                      return (
                        <StyledTableCell {...tableCellProps} key={innerField.id}>
                          <TextField
                              id="date"
                              // label="Birthday"
                              type={innerField.type === "Date" ? "date" : undefined}
                              defaultValue={innerField.editable ? innerField.value : innerField.defaultValue}
                              className={classes.textField}
                              // InputLabelProps={{
                              //     shrink: true,
                              // }}
                          />
                        </StyledTableCell>
                      );
                    } else {
                      return (
                        <StyledTableCell {...tableCellProps} key={innerField.id}>
                          {innerField.defaultValue}
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
    );
  }
  
}

export default withStyles(styles)(CustomizedTables);