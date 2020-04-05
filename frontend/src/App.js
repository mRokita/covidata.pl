import React from 'react';
import './App.css';
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Toolbar from "@material-ui/core/Toolbar";
import AppBar from "@material-ui/core/AppBar";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Main from "./components/Main";


const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    title: {
        width: '100%'
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
}));


function App() {
    const classes = useStyles();
    return (
        <React.Fragment>
            <CssBaseline/>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" align={'center'} className={classes.title}>
                        covidata.pl
                    </Typography>
                </Toolbar>
            </AppBar>
                <Main style={{minHeight: '100vw'}}/>
        </React.Fragment>
    );
}

export default App;
