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

const UpdatePasswordDialog = ({ open, onClose, history }) => {
    const [oldPassword, setOldPassword] = React.useState('');
    const [newPassword, setNewPassword] = React.useState('');
    const [newConfirmPassword, setNewConfirmPassword] = React.useState('');
    const [formError, setFormError] = React.useState('');
    const [loading, setLoading] = React.useState(false);

    React.useEffect(() => {
        setOldPassword('');
        setNewPassword('');
        setNewConfirmPassword('');
        setFormError('');
    }, [open]);

    const handleOnChangeOldPassword = (e) => {
        setFormError('');
        setOldPassword(e.target.value);
    };

    const handleOnChangeNewPassword = (e) => {
        setFormError('');
        setNewPassword(e.target.value);
    };

    const handleOnChangeNewConfirmPassword = (e) => {
        setFormError('');
        setNewConfirmPassword(e.target.value);
    };

    const handleUpdatePassword = () => {
        if (!oldPassword || !newPassword || !newConfirmPassword) {
            setFormError('Please complete the form');
        } else if (!/^(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/.test(newPassword)) {
            setFormError('Password should contain minimum six characters consisting of letters, numbers and special characters (@, $, !, %, *, #, ?, &). There should be at least one special character');
        } else if (newPassword !== newConfirmPassword) {
            setFormError('New passwords do not match');
        } else {
            const token = Cookies.get('token');
            if (token) {
                setFormError('');
                setLoading(true);

                axios.put(
                        `${BACKEND_URL}/user/me/password`,
                        {
                            oldPassword,
                            newPassword,
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
            <DialogTitle id="form-dialog-title">Update Password</DialogTitle>
            <DialogContent>
                <DialogContentText>
                Please enter your old password and new password
                </DialogContentText>
                <TextField
                    autoFocus
                    margin="dense"
                    id="old-password"
                    label="Old Password"
                    type="password"
                    fullWidth
                    value={oldPassword}
                    onChange={handleOnChangeOldPassword}
                />
                <TextField
                    margin="dense"
                    id="new-password"
                    label="New Password"
                    type="password"
                    fullWidth
                    value={newPassword}
                    onChange={handleOnChangeNewPassword}
                />
                <TextField
                    margin="dense"
                    id="re-new-password"
                    label="Re-Enter New Password"
                    type="password"
                    fullWidth
                    value={newConfirmPassword}
                    onChange={handleOnChangeNewConfirmPassword}
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

export default UpdatePasswordDialog;