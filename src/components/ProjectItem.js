import React from 'react';
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import ImageIcon from "@material-ui/icons/Image";
import ListItemText from "@material-ui/core/ListItemText";
import ListItem from "@material-ui/core/ListItem";
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';

const ProjectItem = props => {

    return (
        <div className="ProjectItem">
            <div className={`details ${props.even && "item-even"}`}>
                <ListItem button onClick={props.onClickItem}>
                    <ListItemAvatar>
                        <Avatar>
                            <ImageIcon />
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={props.ct} secondary={props.customerName} />
                </ListItem>
            </div>
            {
                props.showDelete &&
                <div className={`delete-button ${props.even && "item-even"}`} onClick={props.onClickDelete}>
                    <DeleteIcon color={"action"} style={{width: '80%', height: '80%'}}/>
                </div>
            }
            {
                props.showEdit &&
                <div className={`edit-button ${props.even && "item-even"}`} onClick={props.onClickEdit}>
                    <EditIcon color={"action"} style={{width: '80%', height: '80%'}}/>
                </div>
            }
        </div>
);
};

export default ProjectItem;