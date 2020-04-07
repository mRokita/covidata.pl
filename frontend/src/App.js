import React from 'react';
import './App.css';
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Toolbar from "@material-ui/core/Toolbar";
import AppBar from "@material-ui/core/AppBar";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Stats from "./components/Stats";
import blue from "@material-ui/core/colors/blue";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import Avatar from "@material-ui/core/Avatar";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect,
    Link
} from "react-router-dom";
import {LoadingCircle} from "./components/common/LoadingCircle";
import {CardChart} from "./components/common/CardChart";
import {Http404} from "./components/Http404";
import {DetailModal} from "./components/common/DetailModal";


const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    title: {
        width: '100%',
        color: blue[500],
        textDecoration: 'none',
    },
    menuButton: {
        marginRight: theme.spacing(2)
    },
    menuIcon: {
        fill: blue[500]
    },
    toolbar: {
        background: '#ffffff',
        color: blue[500],
    }
}));


function App() {
    const classes = useStyles();
    return (
        <Router>
            <CssBaseline/>
            <AppBar position="static">
                <Toolbar className={classes.toolbar}>
                    <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
                        <MenuIcon className={classes.menuIcon}/>
                    </IconButton>
                        <Typography variant="h6" className={classes.title}>
                            <Link to="/" className={classes.title}>covidata.pl</Link>
                        </Typography>

                    <Avatar src="/wut.png"
                            imgProps={{"style": {objectFit: 'contain', height: '34px', transform: 'rotate(90deg)'}}}
                            variant="square"></Avatar>
                    <Avatar src="/weiti.png" imgProps={{"style": {objectFit: 'contain', height: '30px', paddingTop: 2}}}
                            variant="square"></Avatar>
                </Toolbar>
            </AppBar>
            <Switch>
                <Route exact path="/">
                    <Redirect to="/stats"/>
                </Route>
                <Route exact path="/stats/">
                    <Redirect to="/stats/local"/>
                </Route>
                <Route path="/stats/:reportType" render={()=> <Stats/>}/>
                <Route exact path="/404" component={Http404}/>
                <Redirect to="/404" />
            </Switch>
        </Router>
    );
}

export default App;
