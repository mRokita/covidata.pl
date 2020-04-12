import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import React, {useEffect, useState} from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import blue from "@material-ui/core/colors/blue";
import axios from "axios";
import {API_URL} from "../../index";
import {useHistory} from "react-router-dom";


const useStyles = makeStyles(theme => ({
    title: {
        flexGrow: 1,
    },
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
}));


export const DetailModalToolbar = ({regionId, regionName, reportType, onClose}) => {
    const classes = useStyles();
    const [title, setTitle] = useState("Ładowanie...");
    const history = useHistory();
    useEffect(() => {
        axios.get(`${API_URL}regions/${regionId}`).then((response) => {
            let title = response.data.name;
            if (title !== regionName || reportType !== response.data.report_type) history.push("/404");
            setTitle(title);
        }).catch(error => {
            history.push("/404");
        })
    }, [history, reportType, regionId, regionName]);
    return (
        <AppBar position="static">
            <Toolbar className={classes.detailToolbar}>
                <Typography variant="h6" className={classes.title}>
                    {title}
                </Typography>
                <IconButton edge="end" color="inherit" onClick={onClose} aria-label="close">
                    <CloseIcon className={classes.closeIcon}/>
                </IconButton>
            </Toolbar>
        </AppBar>
    )
};
