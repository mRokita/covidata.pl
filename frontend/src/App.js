import React from 'react';
import './App.css';
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import Toolbar from "@material-ui/core/Toolbar";
import AppBar from "@material-ui/core/AppBar";
import MenuIcon from "@material-ui/icons/Menu";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import {Global} from "./common/Global";


const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
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
                    <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
                        <MenuIcon/>
                    </IconButton>
                    <Typography variant="h6" className={classes.title}>
                        covidata.pl
                    </Typography>
                </Toolbar>
            </AppBar>
            <Container component={Paper} style={{paddingTop: '20px', paddingBottom: '20px'}}>
                <Global/>
            </Container>
        </React.Fragment>
    );
}

export default App;
