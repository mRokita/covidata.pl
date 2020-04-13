import axios from "axios";
import {API_URL} from "../../index";
import {clearReports, setReports} from "../../redux/actions";
import {useDispatch} from "react-redux";
import {Redirect, Route, Switch, useHistory, useParams, useRouteMatch} from "react-router-dom";
import React, {useEffect} from "react";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import BottomNavigation from "@material-ui/core/BottomNavigation";
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";

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
        }).catch((err) => {console.log(err);});
}


export default function ReportsProvider({ urlPrefix, modalComponent, children }) {
    const dispatch = useDispatch();
    const history = useHistory();
    const { reportType } = useParams();
    const { path } = useRouteMatch();
    useEffect(() => {
        loadReports(dispatch, reportType);
    }, [dispatch, reportType]);
    const modalUrl = `${urlPrefix}/:reportType/:regionName/:regionId?`; // Region id is unknown for snapshot generator
    const c = ()=> modalComponent({exitUrl: `${urlPrefix}/${reportType}`});
    if (!['global', 'local'].includes(reportType))
        return <Redirect to={"/404"} />;
    return (
        <React.Fragment>
            <Container component={Paper} style={{paddingTop: '20px', paddingBottom: '20px'}}>
                {React.Children.map(children, child => React.cloneElement(child, {reportType: reportType}))}
                <Switch>
                    <Route exact path={path} />
                    <Route path={modalUrl} component={c}/>
                    <Redirect to="/404" />
                </Switch>
            </Container>
            <div style={{height: '50px'}}>&nbsp;</div>
            <Box boxShadow={5} style={{position: 'fixed', bottom: 0, width: '100%'}}>
                <BottomNavigation










                    showLabels
                    onChange={(event, newValue) => {
                        if(reportType !== newValue) dispatch(clearReports(reportType));
                        history.push(`${urlPrefix}/${newValue}`);
                    }}
                    value={reportType}>
                    <BottomNavigationAction label="Polska"
                                            value={"local"}
                                            icon={<img src="https://cdnjs.cloudflare.com/ajax/libs/emojione/2.2.7/assets/png/1f1f5-1f1f1.png" style={{height: 30, fontSize: '26px', marginBottom: 3}} alt="🇵🇱"/>}/>
                    <BottomNavigationAction label="Świat"
                                            value={"global"}
                                            icon={<img src="https://twemoji.maxcdn.com/2/72x72/1f30d.png" style={{height: 30, fontSize: '25px', marginBottom: 3}} alt={"🌍"}/>}/>
                </BottomNavigation>
            </Box>
        </React.Fragment>
    )
}