import React from "react";
import {LatestFilterBox} from "./LatestFilterBox";
import Paper from "@material-ui/core/Paper";
import {LoadingCircle} from "./common/LoadingCircle";
import {useSelector} from "react-redux";
import {Alert} from "@material-ui/lab"
import {Redirect} from "react-router-dom";
import LatestTable from "./LatestTable";
import {reportTypeSettings} from "../config";


const LatestChartsAlert = (props) => {
    const reportsLoaded = useSelector(state => state[props.reducerKey].reportsLoaded);
    if (!reportsLoaded) return null;
    return (
        <Alert severity="info" color="info" style={{marginTop: 20}}>
            Kliknij wiersz w tabeli, aby zobaczyć wykresy
        </Alert>
    );
};




export const Latest = React.memo(function Latest({reportType}){
    if(!reportTypeSettings.hasOwnProperty(reportType)) return <Redirect to="/404" />;
    const settings = reportTypeSettings[reportType];
    return (
        <React.Fragment>
            <LatestFilterBox reducerKey={settings.reducerKey} reportType={settings.reportType}/>
            <LatestChartsAlert reducerKey={settings.reducerKey}/>
            <Paper style={{marginTop: 20}}>
            <LatestTable settings={settings} />
            </Paper>
            <LoadingCircle reducerKey={settings.reducerKey}/>

        </React.Fragment>
    )
});