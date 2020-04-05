import React, {useCallback, useEffect, useState} from "react";
import {API_URL} from "../index";
import Dialog from "@material-ui/core/Dialog";
import Grow from "@material-ui/core/Grow";
import DialogContent from "@material-ui/core/DialogContent";
import axios from "axios";
import {DetailModalToolbar} from "./DetailModalToolbar";
import {CardChart} from "./CardChart";
import Grid from "@material-ui/core/Grid";

const DetailBody = (props) => {
    return props.settings.map(p =>
        <Grid item xs={12} md={6} key={p.title}>
            <CardChart component={p.component} title={p.title} data={props.data}>
                {
                    p.series.map(s =>
                        <s.component type="monotone" name={s.name} dataKey={s.dataKey} key={s.dataKey}
                                     fill={s.stroke}
                                     stroke={s.stroke}/>
                    )
                }
            </CardChart></Grid>
    )
};

export const DetailModal = (props) => {
    const [data, setData] = useState([]);
    const closeHandler = useCallback(() => {setData([]); props.onClose()}, [props.regionDayReport.region_id]);
    useEffect(() => {
        const drp = props.regionDayReport;
        if (!props.show) return;
        axios.get(API_URL + 'regions/' + drp.region_id + '/day_reports')
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
    }, [props.regionDayReport, props.show]);

    const drp = props.regionDayReport;
    return (
        <Dialog open={props.show} fullScreen onClose={closeHandler} TransitionComponent={Grow}>
            <DetailModalToolbar title={drp.region_name} onClose={closeHandler}/>
            <DialogContent style={{padding: '20px'}}>
                <Grid container spacing={3}>
                    {props.show ? <DetailBody settings={props.settings} data={data}/>: null}
                </Grid>
            </DialogContent>
        </Dialog>
    );
};