import {useDispatch, useSelector} from "react-redux";
import React, {useEffect, useState} from "react";
import {API_URL} from "../index";
import {setGlobalReports} from "../redux/actions";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import axios from "axios";
import {GlobalDetailModal} from "./GlobalDetailModal";
import TableBody from "@material-ui/core/TableBody";


const GlobalTableRow = (props) => {
    const [selected, setSelected] = useState(false);
    const drp = props.regionDayReport;
    return (
        <React.Fragment>
            <TableRow key={drp.region_id} onClick={() => setSelected(true)} style={{cursor: 'pointer'}}>
                <TableCell style={{maxWidth: '30vw'}}>{drp.region_name}</TableCell>
                <TableCell style={{maxWidth: '20vw'}}>{drp.total_cases}</TableCell>
                <TableCell style={{maxWidth: '20vw'}}>{drp.total_recoveries}</TableCell>
                <TableCell style={{maxWidth: '20vw'}}>{drp.total_deaths}</TableCell>
            </TableRow>
            <GlobalDetailModal show={selected} onClose={() => setSelected(false)} regionDayReport={drp}/>
        </React.Fragment>
    )
};


export const GlobalTableBody = () => {
    const dispatch = useDispatch();
    const searchText = useSelector(state => state.globalReports.searchText);
    const reports = useSelector(state => state.globalReports.reports);

    useEffect(() => {
        axios.get(API_URL + 'latest_day_reports?report_type=local')
            .then((response) => {
                dispatch(setGlobalReports(response.data))
            })
    });

    return <TableBody>
        {
            reports.map(
                (value) =>
                    (
                        value.region_name.toLowerCase().includes(searchText.toLowerCase()) ?
                            <GlobalTableRow regionDayReport={value} key={value.region_id}/>
                            :
                            null
                    )
            )
        }
    </TableBody>
};