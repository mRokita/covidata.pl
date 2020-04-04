import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import {Latest} from "../common/Latest";
import Box from "@material-ui/core/Box";
import BottomNavigation from "@material-ui/core/BottomNavigation";
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";
import Icon from "@material-ui/core/Icon";
import React, {useCallback, useEffect, useState} from "react";
import {LineChart} from "recharts";
import Line from "recharts/lib/cartesian/Line";
import {useDispatch} from "react-redux";
import axios from "axios";
import {API_URL} from "../index";
import {clearReports, setReports} from "../redux/actions";
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
            ]
        },
    ],
    columns: [
        {name: "Zachorowania", dataKey: "total_cases"},
        {name: "Zgony", dataKey: "total_deaths"},
    ]
};
function loadReports(dispatch, type){
    axios.get(API_URL + 'latest_day_reports?report_type=' + type)
        .then((response) => {
            dispatch(setReports(type, response.data))
        });
}

export default function Main() {
    const [selectedReportType, setSelectedReportType] = useState("local");
    const dispatch = useDispatch();
    useEffect(() => {
        loadReports(dispatch, selectedReportType);
    }, [selectedReportType]);
    return (
        <React.Fragment>
            <Container component={Paper} style={{paddingTop: '20px', paddingBottom: '80px'}}>
                { selectedReportType == "global" ? <Latest settings={globalSettings}/> :
                <Latest settings={localSettings}/>}
            </Container>
            <Box boxShadow={5} style={{position: 'fixed', bottom: 0, width: '100%'}}>
                <BottomNavigation
                    showLabels
                    onChange={(event, newValue) => {
                        dispatch(clearReports(selectedReportType));
                        loadReports(dispatch, selectedReportType);
                        setSelectedReportType(newValue);
                    }}
                    value={selectedReportType}>
                    <BottomNavigationAction label="Polska"
                                            value={"local"}
                                            icon={<Icon style={{height: 30}}>🇵🇱</Icon>}/>
                    <BottomNavigationAction label="Świat"
                                            value={"global"}
                                            icon={<Icon style={{height: 30}}>🌍</Icon>}/>
                </BottomNavigation>
            </Box>
        </React.Fragment>
    )
}