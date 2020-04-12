import React, {useEffect, useState} from "react";
import {API_URL} from "../../index";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import axios from "axios";
import {DetailModalToolbar} from "./DetailModalToolbar";
import {CardChart} from "./CardChart";
import Grid from "@material-ui/core/Grid";
import Slide from "@material-ui/core/Slide";
import {useHistory, useParams} from "react-router-dom";
import {reportTypeSettings} from "../../config";

import {Helmet} from "react-helmet";

function DetailBody({reportType, regionId}){
    const [data, setData] = useState([]);
    const settings = reportTypeSettings[reportType];
    useEffect(() => {
        axios.get(`${API_URL}regions/${regionId}/day_reports`)
            .then((response) => {
                let reports = response.data;
                let prev_report = {total_cases: 0};
                reports = reports.map(
                    report => {
                        prev_report = {
                            ...report,
                            total_cases_delta: report.total_cases - prev_report.total_cases,
                            active_cases: report.total_cases - report.total_deaths - report.total_recoveries
                        };
                        return prev_report
                    }
                );
                setData(reports);
            })
    }, [regionId]);
    return settings.detail.map(p =>
        <Grid item xs={12} md={6} key={p.title}>
            <CardChart component={p.component} title={p.title} data={data}>
                {
                    p.series.map(s =>
                        <s.component type="monotone" name={s.name} dataKey={s.dataKey} key={s.dataKey}
                                     fill={s.stroke}
                                     stroke={s.stroke}/>
                    )
                }
            </CardChart>
        </Grid>
    )
}

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export function DetailModal({exitUrl}){
    const {reportType, regionName, regionId} = useParams();
    const [open, setOpen] = useState(true);
    const history = useHistory();
    const closeHandler = () => setOpen(false);
    const exitedHandler = () => history.replace(exitUrl);
    return (
        <Dialog open={open} fullScreen onClose={closeHandler} onExited={exitedHandler} TransitionComponent={Transition}>
            <Helmet>
                <title>{regionName}</title>
            </Helmet>
            <DetailModalToolbar regionId={regionId} reportType={reportType} regionName={regionName} onClose={closeHandler}/>
            <DialogContent style={{padding: '20px'}} onClose={closeHandler}>
                <Grid container spacing={3}>
                    <DetailBody reportType={reportType} regionId={regionId}/>
                </Grid>
            </DialogContent>
        </Dialog>
    );
}