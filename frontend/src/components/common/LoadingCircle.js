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


export const LoadingCircle = (props) => {
    const classes = useStyles();
    const reportsLoaded = useSelector(state => state[props.reducerKey].reportsLoaded);
    if (reportsLoaded) return null;
    return (
        <Grid container justify={'center'} className={classes.root} style={{padding: '20px'}}>
            <CircularProgress/>
        </Grid>
    )
};