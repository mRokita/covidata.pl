import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import {Provider} from "react-redux";
import store from "./redux/store";

const HOST = window.location.hostname;
let api_url = 'http://localhost:8000/api/v1/';
if (HOST === 'covidata.localhost') {
    api_url = 'http://covidata.localhost/api/v1/';
} else if (HOST === 'covidata.pl') {
    api_url = 'https://covidata.pl/api/v1/';
}

export const API_URL = api_url;

ReactDOM.render(
    <React.StrictMode>
        <Provider store={store}>
            <App/>
        </Provider>
    </React.StrictMode>,
    document.getElementById('root')
);


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
