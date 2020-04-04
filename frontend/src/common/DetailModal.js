import React, {useEffect, useState} from "react";
import {API_URL} from "../index";
import Dialog from "@material-ui/core/Dialog";
import Grow from "@material-ui/core/Grow";
import Typography from "@material-ui/core/Typography";
import DialogContent from "@material-ui/core/DialogContent";
import axios from "axios";
import {DetailModalToolbar} from "./DetailModalToolbar";
import {CardChart} from "./CardChart";

const DetailBody = (props) => {
    return props.settings.map(p =>
        <CardChart component={p.component} title={p.title} data={props.data} key={p.title}>
            {
                p.series.map(s =>
                    <s.component type="monotone" name={s.name} dataKey={s.dataKey} key={s.dataKey}
                                 fill={s.stroke}
                          stroke={s.stroke}/>
                )
            }
        </CardChart>
    )
};

export const DetailModal = (props) => {
    const [data, setData] = useState([]);
    const drp = props.regionDayReport;
    useEffect(() => {
        console.log('effct');
        setData([]);
        if(!props.show) return;
        console.log('loadrepo');
        axios.get(API_URL + 'regions/' + drp.region_id + '/day_reports')
            .then((response) => {
                setData(response.data);
            })
    }, [drp.region_id, props.show]);

    return (
        <Dialog open={props.show} fullScreen onClose={props.onClose} TransitionComponent={Grow}>
            <DetailModalToolbar title = {drp.region_name} onClose={props.onClose} />
            <DialogContent style={{padding: '20px'}}>
                <Typography variant="h6" style={{marginBottom: 20}}>
                    Statystyki
                </Typography>
                <DetailBody settings={props.settings} data={data}/>
            </DialogContent>
        </Dialog>
    );
};