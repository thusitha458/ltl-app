import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles';
import { Divider } from '@material-ui/core';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

class Login extends Component {
    render() {
        const {classes} = this.props;
        return (
            <div className={classes.root}>
                <div className={classes.content}>
                <FormControl className={classes.formControl}>
                    <InputLabel id="demo-simple-select-label">Role</InputLabel>
                    <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    className={classes.formField}
                    // value={age}
                    // onChange={handleChange}
                    >
                    <MenuItem value={"ADMIN"}>ADMIN</MenuItem>
                    <MenuItem value={"EE"}>EE</MenuItem>
                    <MenuItem value={"SPE"}>SPE</MenuItem>
                    </Select>

                    <TextField className={classes.formField} id="password" label="Password" variant="standard" />

                    <Button className={classes.formField} variant="contained">Login</Button>
                </FormControl>
                </div>
            </div>
        );
    }
}

const styles = {
    root: {
        marginLeft: 'auto',
        marginRight: 'auto',
        width: 400,
        height: 400,
        // backgroundColor: 'red',
        border: '1px solid black',
        textAlign: 'center',
    },
    content: {
        margin: 'auto',
    },
    formControl: {
        // margin: theme.spacing(1),
        marginTop: 20,
        minWidth: 120,
    },
    formField: {
        marginTop: 10,
    },
};

export default withStyles(styles)(Login);