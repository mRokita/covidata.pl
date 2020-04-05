import {useSelector} from "react-redux";
import React, {useState} from "react";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import {DetailModal} from "./DetailModal";
import TableBody from "@material-ui/core/TableBody";


const MainTableRow = (props) => {
    const [selected, setSelected] = useState(false);
    const drp = props.regionDayReport;
    const columns = props.settings.columns;
    return (
        <React.Fragment>
            <TableRow key={drp.region_id} onClick={() => !selected ? setSelected(true) : null} style={{cursor: 'pointer'}}>
                <TableCell style={{maxWidth: '30vw'}}>{drp.region_name}</TableCell>
                {
                    columns.map(c =>
                        <TableCell key={c.dataKey} style={{maxWidth: '20vw'}}>{drp[c.dataKey]}</TableCell>
                    )
                }
            </TableRow>
            <DetailModal show={selected} onClose={() => setSelected(false)} settings={props.settings.detail} regionDayReport={drp}/>
        </React.Fragment>
    )
};


export const LatestTableBody = (props) => {
    const searchText = useSelector(state => (state[props.reducerKey].searchText));
    const reports = useSelector(state => (state[props.reducerKey].reports));

    return <TableBody>
        {
            reports.map(
                (value) =>
                    (
                        value.region_name.toLowerCase().includes(searchText.toLowerCase()) ?
                            <MainTableRow regionDayReport={value} key={value.region_id} settings={props.settings}/>
                            :
                            null
                    )
            )
        }
    </TableBody>
};