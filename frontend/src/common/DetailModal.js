import React, {useCallback, useEffect, useState} from "react";
import {API_URL} from "../index";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import axios from "axios";
import {DetailModalToolbar} from "./DetailModalToolbar";
import {CardChart} from "./CardChart";
import Grid from "@material-ui/core/Grid";
import {Zoom} from "@material-ui/core";

const DetailBody = (props) => {
    const [data, setData] = useState([]);
    useEffect(() => {
        const drp = props.regionDayReport;
        if(!props.show) return;
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
    }, [props.show, props.regionDayReport]);
    return props.settings.map(p =>
        <Grid item xs={12} md={6} key={p.title}>
            <CardChart component={p.component} title={p.title} data={data}>
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
    const drp = props.regionDayReport;
    return (
        <Dialog open={props.show} fullScreen onClose={props.onClose} TransitionComponent={Zoom}>
            <DetailModalToolbar title={drp.region_name} onClose={props.onClose}/>
            <DialogContent style={{padding: '20px'}}>
                <Grid container spacing={3}>
                    <DetailBody settings={props.settings} regionDayReport={drp} show={props.show}/>
                </Grid>
            </DialogContent>
        </Dialog>
    );
};