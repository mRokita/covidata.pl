import {useSelector} from "react-redux";
import Grid from "@material-ui/core/Grid";
import {CircularProgress} from "@material-ui/core";
import React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";


const useStyles = makeStyles((theme) => ({
   root: {
       flexGrow: 1
   }
}));


export const LoadingCircle = () => {
    const classes = useStyles();
    const reportsLoaded = useSelector(state => state.globalReports.reportsLoaded);
    if (reportsLoaded) return null;
    return (
        <Grid container xs={12} justify={'center'} className={classes.root} style={{padding: '20px'}}>
            <CircularProgress/>
        </Grid>
    )
};