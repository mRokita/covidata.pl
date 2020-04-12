import React, {useState} from 'react';
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
import MapIcon from '@material-ui/icons/Map';
import EqualizerIcon from '@material-ui/icons/Equalizer';
import InfoIcon from '@material-ui/icons/Info';


import {
    BrowserRouter as Router,
    Switch,
    Route,
    useHistory,
    Redirect,
    Link
} from "react-router-dom";
import {Http404} from "./components/Http404";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItem from "@material-ui/core/ListItem";
import List from "@material-ui/core/List";
import Maps from "./components/Maps";


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

function Nav() {
    const classes = useStyles();
    const [drawerOpen, setDrawerOpen] = useState(false);
    const history = useHistory();
    const clickHandler = (url) => () => {history.push(url); setDrawerOpen(false);}
    return <React.Fragment>

        <AppBar position="fixed" className={classes.toolbar}>
            <Toolbar className={classes.toolbar}>
                <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu" onClick={() => setDrawerOpen(!drawerOpen)}>
                    <MenuIcon className={classes.menuIcon}/>
                </IconButton>
                <Typography variant="h6" className={classes.title}>
                    <Link to="/" className={classes.title}>covidata.pl</Link>
                </Typography>
                <a href={"https://pw.edu.pl"}><Avatar src="/wut.png"
                        imgProps={{"style": {objectFit: 'contain', height: '34px', transform: 'rotate(90deg)'}}}
                                                   variant="square"/></a>
                <a href={"http://elka.pw.edu.pl"}><Avatar src="/weiti.png" imgProps={{"style": {objectFit: 'contain', height: '30px', paddingTop: 2}}}
                                                           variant="square"/></a>
            </Toolbar>
        </AppBar>
        <SwipeableDrawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onOpen={() => setDrawerOpen(true)}>
        <div role="presentation"
             style={{width: 250}}>
            <div style={{backgroundColor: blue[500], height: 160}}><Typography variant={"h2"} align={"center"} style={{color: 'white', height: 160, paddingTop: 70}}>covidata</Typography></div>
            <List style={{width: 250}}>
                    <ListItem button onClick={clickHandler("/stats")}>
                        <ListItemIcon><EqualizerIcon/></ListItemIcon>
                        <ListItemText primary="Statystyki" />
                    </ListItem>
                    <ListItem button onClick={clickHandler("/maps")}>
                        <ListItemIcon><MapIcon/></ListItemIcon>
                        <ListItemText primary="Mapa" />
                    </ListItem>
                <ListItem button>
                    <ListItemIcon><InfoIcon/></ListItemIcon>
                    <ListItemText primary="Informacje" />
                </ListItem>
                </List>
            </div>
    </SwipeableDrawer>
    </React.Fragment>
}
function App() {
    return (
        <Router>
            <CssBaseline/>
            <Nav/>
            <div style={{marginBottom: 80}} />
            <Switch>
                <Route exact path="/">
                    <Redirect to="/maps"/>
                </Route>
                <Route exact path="/stats/">
                    <Redirect to="/stats/local"/>
                </Route>
                <Route exact path="/maps/">
                    <Redirect to="/maps/local"/>
                </Route>
                <Route path="/maps/:reportType" render={() => <Maps/>}/>
                <Route path="/stats/:reportType" render={()=> <Stats/>}/>
                <Route exact path="/404" component={Http404}/>
                <Redirect to="/404" />
            </Switch>
        </Router>
    );
}

export default App;
