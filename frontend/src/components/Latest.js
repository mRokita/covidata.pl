import React from "react";
import {LatestFilterBox} from "./LatestFilterBox";
import Paper from "@material-ui/core/Paper";
import {LoadingCircle} from "./common/LoadingCircle";
import {useSelector} from "react-redux";
import {Alert} from "@material-ui/lab"
import {Redirect} from "react-router-dom";
import LatestTable from "./LatestTable";
import {reportTypeSettings} from "../config";
import {Helmet} from "react-helmet";
import Fab from "@material-ui/core/Fab";
import {useHistory} from "react-router-dom";
import MapIcon from '@material-ui/icons/Map';
import Container from "@material-ui/core/Container";

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
    const history = useHistory();
    if(!reportTypeSettings.hasOwnProperty(reportType)) return <Redirect to="/404" />;
    const settings = reportTypeSettings[reportType];
    return (
        <Container component={Paper} style={{paddingTop: '20px', marginBottom: 20, paddingBottom: '20px'}}>
            <Helmet>
                <title>Statystyki</title>
            </Helmet>
            <LatestFilterBox reducerKey={settings.reducerKey} reportType={settings.reportType}/>
            <LatestChartsAlert reducerKey={settings.reducerKey}/>
            <Paper style={{marginTop: 20}}>
            <LatestTable settings={settings} />
            </Paper>
            <LoadingCircle reducerKey={settings.reducerKey}/>
            <Fab style={{position: 'fixed', right: 40, bottom: 100}}
                 onClick={() => history.push(`/maps/${reportType}`)}
                 color="primary" alt="Przejdź do mapy">
                <MapIcon />
            </Fab>
        </Container>
    )
});