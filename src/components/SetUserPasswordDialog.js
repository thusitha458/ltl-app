import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import axios from 'axios';
import {BACKEND_URL} from "../config/config";
import Cookies from 'js-cookie';
import {NotificationManager} from 'react-notifications';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

const SetUserPasswordDialog = ({ open, onClose, history }) => {
    const [password, setPassword] = React.useState('');
    const [role, setRole] = React.useState('');
    const [formError, setFormError] = React.useState('');
    const [loading, setLoading] = React.useState(false);

    React.useEffect(() => {
        setRole('');
        setPassword('');
        setFormError('');
    }, [open]);

    const handleOnChangePassword = (e) => {
        setFormError('');
        setPassword(e.target.value);
    };

    const handleOnChangeRole = (e) => {
        setFormError('');
        setRole(e.target.value);
    };

    const handleUpdatePassword = () => {
        if (!password || !role) {
            setFormError('Please complete the form');
        } else if (!/^(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/.test(password)) {
            setFormError('Password should contain minimum six characters consisting of letters, numbers and special characters (@, $, !, %, *, #, ?, &). There should be at least one special character');
        } else {
            const token = Cookies.get('token');
            if (token) {
                setFormError('');
                setLoading(true);

                axios.put(
                        `${BACKEND_URL}/user/${role}/password`,
                        {
                            password,
                        },
                        {headers: {token: token}},
                    ).then(() => {
                        NotificationManager.success('Password updated successfully!');
                    }).catch(error => {
                        const errorMessage = error.response && error.response.data && error.response.data.error;
                        NotificationManager.error(errorMessage || 'Request failed');
                        if (error.response && error.response.status === 401) {
                            history.push('/login');
                        }
                    }).finally(() => {
                        setLoading(false);
                        onClose();
                    });
            } else {
                history.push('/login');
            }
        }
    };

    return (
        <Dialog open={open} onClose={onClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Set User Password</DialogTitle>
            <DialogContent>
                <DialogContentText>
                Please select the role and password of the user
                </DialogContentText>
                <Select
                    autoFocus
                    fullWidth
                    margin="dense"
                    label="Role"
                    defaultValue={"none"}
                    id="role-select"
                    value={role}
                    onChange={handleOnChangeRole}
                >
                    <MenuItem value={"none"} disabled>Role</MenuItem>
                    <MenuItem value={"SPE"}>SPE</MenuItem>
                    <MenuItem value={"EE"}>EE</MenuItem>
                    <MenuItem value={"AM C&P"}>AM C&P</MenuItem>
                    <MenuItem value={"QA"}>QA</MenuItem>
                    <MenuItem value={"PE"}>PE</MenuItem>
                    <MenuItem value={"TE"}>TE</MenuItem>
                </Select>
                <TextField
                    autoFocus
                    margin="dense"
                    id="old-password"
                    label="Old Password"
                    type="password"
                    fullWidth
                    value={password}
                    onChange={handleOnChangePassword}
                />
                {formError && <div style={{color: 'red'}}>{formError}</div>}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary" disabled={loading}>
                Cancel
                </Button>
                <Button onClick={handleUpdatePassword} color="primary" disabled={loading}>
                Update
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default SetUserPasswordDialog;