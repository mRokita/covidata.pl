import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import purple from "@material-ui/core/colors/purple";


const useStyles = makeStyles(theme => ({
    detailToolbar: {
        background: purple[800],
        color: 'white'
    },
    title: {
        flexGrow: 1,
    },
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
}));


export const DetailModalToolbar = (props) => {
    const classes = useStyles();
    return (
        <AppBar position="static">
            <Toolbar className={classes.detailToolbar}>
                <Typography variant="h6" className={classes.title}>
                    {props.title}
                </Typography>
                <IconButton edge="end" color="inherit" onClick={props.onClose} aria-label="close">
                    <CloseIcon/>
                </IconButton>
            </Toolbar>
        </AppBar>
    )
};
