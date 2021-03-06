import React from 'react';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import {Provider} from "react-redux";
import store from "./redux/store";
import ReactGA from 'react-ga';
import { hydrate, render } from 'react-dom';
import {createMuiTheme, ThemeProvider, StylesProvider} from "@material-ui/core/styles";
import blue from "@material-ui/core/colors/blue";
import {createGenerateClassName} from "@material-ui/styles";
import ServerStyleSheets from "@material-ui/styles/ServerStyleSheets";
import ReactDOMServer from 'react-dom/server';
const HOST = window.location.hostname;
let debug_url = 'http://192.168.1.14:8000/api/v1/';
let api_url = `${debug_url}`;

if (navigator.userAgent === 'ReactSnap'){
    api_url = 'https://covidata.pl/api/v1/'
} else if (HOST === 'covidata.localhost') {
    api_url = 'http://covidata.localhost/api/v1/';
} else if (HOST === 'frontend') {
    api_url = 'http://api/api/v1/';
} else if (HOST === 'covidata.pl') {
    api_url = 'https://covidata.pl/api/v1/';
}

if (navigator.userAgent !== 'ReactSnap'){
    ReactGA.initialize('UA-163403425-1', {debug: debug_url === api_url});
    ReactGA.pageview(window.location.pathname);
}

export const API_URL = api_url;
const theme = createMuiTheme({
    palette: {
        primary: {
            // light: will be calculated from palette.primary.main,
            // eslint-disable-next-line no-undef
            contrastText: '#ffffff',
            main: blue[500]
            // dark: will be calculated from palette.primary.main,
            // contrastText: will be calculated to contrast with palette.primary.main
        },
        secondary: {
            // light: '#0066ff',
            contrastText: blue[500],
            // dark: will be calculated from palette.secondary.main,
            main: '#ffffff',
        },
        // Used by `getContrastText()` to maximize the contrast between
        // the background and the text.
        contrastThreshold: 3,
        // Used by the functions below to shift a color's luminance by approximately
        // two indexes within its tonal palette.
        // E.g., shift from Red 500 to Red 300 or Red 700.
        tonalOffset: 0.2,
    },
});

const generateClassName = createGenerateClassName({
    seed: '350',
});


const app = (
    <StylesProvider generateClassName={generateClassName}>
        <Provider store={store}>
            <ThemeProvider theme={theme}>
                <App/>
            </ThemeProvider>
        </Provider>
    </StylesProvider>
);

const rootElement = document.getElementById("root");
if (rootElement.hasChildNodes()) {
    render(app, rootElement); // Kinda dirty, but hey, bots can read meta!
} else {
    render(app, rootElement);
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
