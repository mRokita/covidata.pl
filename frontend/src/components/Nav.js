import React, {useState} from "react";
import {Link, useHistory} from "react-router-dom";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import blue from "@material-ui/core/colors/blue";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import EqualizerIcon from "@material-ui/icons/Equalizer";
import ListItemText from "@material-ui/core/ListItemText";
import MapIcon from "@material-ui/icons/Map";
import InfoIcon from "@material-ui/icons/Info";
import makeStyles from "@material-ui/core/styles/makeStyles";
import staticSites from "../static-sites";

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


export function Nav() {
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
                <a href={"https://pw.edu.pl"}>
                    <Avatar src="/wut.png"
                            imgProps={{
                                "style": {
                                    objectFit: 'contain',
                                    height: '34px',
                                    transform: 'rotate(90deg)'
                                }
                            }}
                            variant="square"/>
                </a>
                <a href={"http://elka.pw.edu.pl"}>
                    <Avatar src="/weiti.png"
                            imgProps={{
                                "style": {
                                    objectFit: 'contain',
                                    height: '30px',
                                    paddingTop: 2
                                }
                            }}
                            variant="square"/>
                </a>
            </Toolbar>
        </AppBar>
        <SwipeableDrawer
            anchor="left"
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            onOpen={() => setDrawerOpen(true)}>
            <div role="presentation"
                 style={{width: 250}}>
                <div style={{backgroundColor: "#eee", height: 160}}>
                    <Typography variant={"h2"} align={"center"}
                                style={{
                                    color: blue[500],
                                    height: 160,
                                    paddingTop: 70
                                }}>covidata
                    </Typography>
                </div>
                <List style={{width: 250}}>
                    <ListItem component={Link} to={"/stats"} onClick={clickHandler} button>
                        <ListItemIcon><EqualizerIcon/></ListItemIcon>
                        <ListItemText primary="Statystyki"/>
                    </ListItem>
                    <ListItem component={Link} to={"/maps"} button onClick={clickHandler}>
                        <ListItemIcon><MapIcon/></ListItemIcon>
                        <ListItemText primary="Mapa"/>
                    </ListItem>
                    { staticSites.map( ({url, title, icon: Icon}) =>
                        <ListItem key={url} component={Link} to={url} button onClick={clickHandler}>
                            <ListItemIcon><Icon/></ListItemIcon>
                            <ListItemText primary={title}/>
                        </ListItem>
                    )
                    }
                </List>
            </div>
        </SwipeableDrawer>
    </React.Fragment>
}