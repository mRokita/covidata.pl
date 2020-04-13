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
import createHistory from 'history/createBrowserHistory';


import {
    Router,
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
import {Helmet} from "react-helmet";
import ReactGA from "react-ga";
import {MarkdownPage} from "./components/common/MarkdownPage";


const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    title: {
        width: '100%',
        color: blue[500],
        textDecoration: 'none',
    }
}));

function Nav() {
    const classes = useStyles();
    const [drawerOpen, setDrawerOpen] = useState(false);
    const history = useHistory();
    const clickHandler = () => {
        setDrawerOpen(false);
    };
    return <React.Fragment>

        <AppBar color="secondary" position="fixed">
            <Toolbar className={classes.toolbar}>
                <IconButton edge="start" color="inherit" aria-label="menu"
                            onClick={() => setDrawerOpen(!drawerOpen)}>
                    <MenuIcon className={classes.menuIcon}/>
                </IconButton>
                <Typography variant="h6" className={classes.title}>
                    <Link to="/" className={classes.title}>covidata.pl</Link>
                </Typography>
                <a href={"https://pw.edu.pl"}><Avatar src="/wut.png"
                                                      imgProps={{
                                                          "style": {
                                                              objectFit: 'contain',
                                                              height: '34px',
                                                              transform: 'rotate(90deg)'
                                                          }
                                                      }}
                                                      variant="square"/></a>
                <a href={"http://elka.pw.edu.pl"}><Avatar src="/weiti.png" imgProps={{
                    "style": {
                        objectFit: 'contain',
                        height: '30px',
                        paddingTop: 2
                    }
                }}
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
                <div style={{backgroundColor: blue[500], height: 160}}><Typography variant={"h2"} align={"center"}
                                                                                   style={{
                                                                                       color: 'white',
                                                                                       height: 160,
                                                                                       paddingTop: 70
                                                                                   }}>covidata</Typography></div>
                <List style={{width: 250}}>
                    <ListItem component={Link} to={"/stats"} onClick={clickHandler} button>
                        <ListItemIcon><EqualizerIcon/></ListItemIcon>
                        <ListItemText primary="Statystyki"/>
                    </ListItem>
                    <ListItem component={Link} to={"/maps"} button onClick={clickHandler}>
                        <ListItemIcon><MapIcon/></ListItemIcon>
                        <ListItemText primary="Mapa"/>
                    </ListItem>
                    <ListItem component={Link} to={"/podstawowe-informacje"} button onClick={clickHandler}>
                        <ListItemIcon><InfoIcon/></ListItemIcon>
                        <ListItemText primary="Podstawowe informacje o wirusie"/>
                    </ListItem>
                    <ListItem component={Link} to={"/symptomy"} button onClick={clickHandler}>
                        <ListItemIcon><InfoIcon/></ListItemIcon>
                        <ListItemText primary="Symptomy"/>
                    </ListItem>
                    <ListItem component={Link} to={"/zagrozenie-i-smiertelnosc"} button onClick={clickHandler}>
                        <ListItemIcon><InfoIcon/></ListItemIcon>
                        <ListItemText primary="Zagrożenie i śmiertelnosć"/>
                    </ListItem>
                    <ListItem component={Link} to={"/mity"} button onClick={clickHandler}>
                        <ListItemIcon><InfoIcon/></ListItemIcon>
                        <ListItemText primary="Fakty, mity, ciekawostki"/>
                    </ListItem>
                    <ListItem  component={Link} to={"/about"} button onClick={clickHandler}>
                        <ListItemIcon><InfoIcon/></ListItemIcon>
                        <ListItemText primary="O nas"/>
                    </ListItem>
                </List>
            </div>
        </SwipeableDrawer>
    </React.Fragment>
}

const history = createHistory();

if (navigator.userAgent !== 'ReactSnap'){
    history.listen((location, action) => {
        ReactGA.pageview(window.location.pathname)
    });
}

function App() {
    return (
        <Router history={history}>
            <CssBaseline/>
            <Helmet titleTemplate={"%s | covidata.pl - Koronawirus. Rzetelnie"} defaultTitle={"covidata.pl - Koronawirus. Rzetelnie"}>
                <meta name="keywords"
                      content="covid,covid19,polska,koronawirus,covidata,maseczki,statystyki,dane,mapy,mapa,wykresy,wykres,zachorowania,wyzdrowienia"/>
                <meta name="description" content=""/>
                <link rel="canonical" href="https://covidata.pl"/>
                <meta charSet="utf-8"/>
                <meta lang="pl" />
            </Helmet>
            <Nav/>
            <div style={{marginBottom: 80}}/>
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
                <Route exact path={"/about"} render={() => <MarkdownPage src={"/md/about.md"}/>} />
                <Route exact path={"/mity"} render={() => <MarkdownPage src={"/md/mity.md"}/>} />
                <Route exact path={"/zagrozenie-i-smiertelnosc"} render={() => <MarkdownPage src={"/md/zagrozenie-i-smiertelnosc.md"}/>} />
                <Route exact path={"/symptomy"} render={() => <MarkdownPage src={"/md/symptomy.md"}/>} />
                <Route exact path={"/podstawowe-informacje"} render={() => <MarkdownPage src={"/md/podstawowe-informacje.md"}/>} />
                <Route path="/maps/:reportType" render={() => <Maps/>}/>
                <Route path="/stats/:reportType" render={() => <Stats/>}/>
                <Route exact path="/404" component={Http404}/>
                <Redirect to="/404"/>
            </Switch>
        </Router>
    );
}

export default App;
