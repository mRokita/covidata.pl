import React from 'react';
import './App.css';
import CssBaseline from "@material-ui/core/CssBaseline";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Stats from "./components/Stats";
import blue from "@material-ui/core/colors/blue";
import createHistory from 'history/createBrowserHistory';


import {
    Link,
    Redirect,
    Route,
    Router,
    Switch,
    useLocation,
    useRouteMatch
} from "react-router-dom";
import {Http404} from "./components/Http404";
import Maps from "./components/Maps";
import {Helmet} from "react-helmet";
import ReactGA from "react-ga";
import {MarkdownPage} from "./components/common/MarkdownPage";
import {Nav} from "./components/Nav";
import staticSites from "./static-sites";
import ListItemIcon from "@material-ui/core/ListItemIcon";


const history = createHistory();

if (navigator.userAgent !== 'ReactSnap') {
    history.listen((location, action) => {
        ReactGA.pageview(window.location.pathname)
    });
}

function Meta() {
    let location = useLocation();
    let url = location.pathname;
    let imageUrl = url === '/' ? '/index' : url;
    return (
        <Helmet titleTemplate={"%s | covidata.pl - Koronawirus. Rzetelnie"}
                defaultTitle={"covidata.pl - Koronawirus. Rzetelnie"}>
            <meta name="keywords"
                  content="covid,covid19,polska,koronawirus,covidata,maseczki,statystyki,dane,mapy,mapa,wykresy,wykres,zachorowania,wyzdrowienia"/>
            <link rel="canonical" href={`https://covidata.pl${url}`}/>
            <meta charSet="utf-8"/>
            <meta lang="pl"/>
            <meta property="og:type" content="website"/>

            <meta property="og:url" content={`https://covidata.pl${url}`}/>
            <meta property="og:image"
                  content={`http://covidata.pl${imageUrl}.png`}/>
            <meta property="og:image:width" content="1200"/>
            <meta property="og:image:height" content="628"/>

            <meta property="twitter:card" content="summary_large_image"/>
            <meta property="twitter:url"
                  content={`https://covidata.pl${url}`}/>
            <meta property="twitter:image"
                  content={`https://covidata.pl${imageUrl}.png`}/>
        </Helmet>
    )
}

function App() {
    return (
        <Router history={history}>
            <CssBaseline/>
            <Meta/>
            <Nav/>
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
                {staticSites.map(
                    ({url, title, description, source}) =>
                        <Route exact key={url} path={url}
                               render={() => <MarkdownPage src={source}
                                                           description={description}
                                                           title={title}/>}/>
                )
                }
                <Route path="/maps/:reportType" render={() => <Maps/>}/>
                <Route path="/stats/:reportType" render={() => <Stats/>}/>
                <Route exact path="/404" component={Http404}/>
                <Redirect to="/404"/>
            </Switch>
        </Router>
    );
}

export default App;
