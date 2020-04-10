import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import {Latest} from "./Latest";
import Box from "@material-ui/core/Box";
import BottomNavigation from "@material-ui/core/BottomNavigation";
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";
import React, {useEffect, useState} from "react";
import {LineChart} from "recharts";
import Line from "recharts/lib/cartesian/Line";
import {useDispatch} from "react-redux";
import axios from "axios";
import {API_URL} from "../index";
import {clearReports, setReports} from "../redux/actions";
import AreaChart from "recharts/lib/chart/AreaChart";
import Area from "recharts/lib/cartesian/Area";
import BarChart from "recharts/lib/chart/BarChart";
import Bar from "recharts/lib/cartesian/Bar";
import {Emojione, Twemoji} from 'react-emoji-render';
import {Redirect, Switch, useLocation, useRouteMatch, useHistory, matchPath, useParams, Route} from "react-router-dom";
import {DetailModal} from "./common/DetailModal";


const globalSettings = {
    reportType: 'global',
    reducerKey: 'globalReports',
    regionLabel: "Kraj",
    detail: [
        {
            title: "Łącznie",
            component: LineChart,
            series: [
                {component: Line, name: "Zachorowania", dataKey: "total_cases", stroke: "#8884d8"},
                {component: Line, name: "Zgony", dataKey: "total_deaths", stroke: "#000000"},
                {component: Line, name: "Wyzdrowienia", dataKey: "total_recoveries", stroke: "#56e336"},
            ]
        },
        {
            title: "Aktywne",
            component: AreaChart,
            series: [
                {component: Area, name: "Liczba chorych", dataKey: "active_cases", stroke: "#6ec5d8"},
            ]
        },
        {
            title: "Dzienny przyrost",
            component: BarChart,
            series: [
                {component: Bar, name: "Przyrost zachorowań", dataKey: "total_cases_delta", stroke: "#d89267"},
            ]
        },
    ],
    columns: [
        {name: "Zachorowania", dataKey: "total_cases"},
        {name: "Zgony", dataKey: "total_deaths"},
        {name: "Wyzdrowienia", dataKey: "total_recoveries"},
    ]
};


const localSettings = {
    reportType: 'local',
    reducerKey: 'localReports',
    regionLabel: "Województwo",
    detail: [
        {
            title: "Łącznie",
            component: LineChart,
            series: [
                {component: Line, name: "Zachorowania", dataKey: "total_cases", stroke: "#8884d8"},
                {component: Line, name: "Zgony", dataKey: "total_deaths", stroke: "#000000"},
            ],
        },
        {
            title: "Dzienny przyrost",
            component: BarChart,
            series: [
                {component: Bar, name: "Przyrost zachorowań", dataKey: "total_cases_delta", stroke: "#d89267"},
            ]
        },
    ],
    columns: [
        {name: "Zachorowania", dataKey: "total_cases"},
        {name: "Zgony", dataKey: "total_deaths"},
    ]
};

function loadReports(dispatch, type) {
    axios.get(API_URL + 'latest_day_reports?report_type=' + type)
        .then((response) => {
            let reports = response.data;
            reports = reports.map(
                report => ({
                    ...report,
                    active_cases: report.total_cases - report.total_deaths - report.total_recoveries
                })
            );
            dispatch(setReports(type, reports));
        });
}


export const statsSettings = {
    global: globalSettings,
    local: localSettings
};

export default function Stats({match}) {
    const dispatch = useDispatch();
    const history = useHistory();
    const { reportType } = useParams();
    const { path, url } = useRouteMatch();
    useEffect(() => {
        loadReports(dispatch, reportType);
    }, [dispatch, reportType]);
    return (
        <React.Fragment>
            <Container component={Paper} style={{paddingTop: '20px', paddingBottom: '20px'}}>
                    <Latest reportType={reportType}/>
                    <Switch>
                        <Route exact path={path} />
                        <Route exact path="/stats/:reportType/:regionName/:regionId" component={DetailModal}/>
                        <Redirect to="/404" />
                    </Switch>

            </Container>
            <div style={{height: '50px'}}>&nbsp;</div>
            <Box boxShadow={5} style={{position: 'fixed', bottom: 0, width: '100%'}}>
                <BottomNavigation
                    showLabels
                    onChange={(event, newValue) => {
                        if(reportType !== newValue) dispatch(clearReports(reportType));
                        history.push(`/stats/${newValue}`);
                    }}
                    value={reportType}>
                    <BottomNavigationAction label="Polska"
                                            value={"local"}
                                            icon={<Emojione style={{height: 30, fontSize: '26px'}} text="🇵🇱"/>}/>
                    <BottomNavigationAction label="Świat"
                                            value={"global"}
                                            icon={<Twemoji style={{height: 30, fontSize: '25px'}} text={"🌍"}/>}/>
                </BottomNavigation>
            </Box>
        </React.Fragment>
    )
}