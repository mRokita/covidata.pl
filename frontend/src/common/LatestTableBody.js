import {useSelector} from "react-redux";
import React, {useRef, useState} from "react";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import {DetailModal} from "./DetailModal";
import TableBody from "@material-ui/core/TableBody";
import LazyLoad from 'react-lazyload';


const MainTableRow = (props) => {
    const [selected, setSelected] = useState(false);
    const clickHandler = () => setSelected(true);
    const columns = props.settings.columns;
    return (
        <LazyLoad height={50} unmountIfInvisible={true}>
            <TableRow key={props.regionDayReport.region_id} onClick={clickHandler} style={{cursor: 'pointer'}}>
                <TableCell style={{maxWidth: '30vw'}}>{props.regionDayReport.region_name}</TableCell>
                {
                    columns.map(c =>
                        <TableCell key={c.dataKey} style={{maxWidth: '20vw'}}>{props.regionDayReport[c.dataKey]}</TableCell>
                    )
                }
            </TableRow>
            <DetailModal onClose={() => setSelected(false)} show={selected}
                         settings={props.settings.detail}
                         regionDayReport={props.regionDayReport}/>
        </LazyLoad>
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