import {useSelector} from "react-redux";
import React, {useEffect, useRef, useState} from "react";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import {DetailModal} from "./common/DetailModal";
import TableBody from "@material-ui/core/TableBody";
import LazyLoad, {forceCheck, forceVisible} from 'react-lazyload';
import {Redirect, Switch, useLocation, useRouteMatch, useHistory, matchPath, useParams, Route} from "react-router-dom";



const MainTableRow = React.memo(function MainTableRow(props) {
    const history = useHistory();
    const {url} = useRouteMatch();
    const clickHandler = () => history.push(`${url}/${props.regionDayReport.region_name}/${props.regionDayReport.region_id}`);
    const columns = props.settings.columns;
    console.log('rerender');
    return (
        <React.Fragment>
            <TableRow key={props.regionDayReport.region_id} onClick={clickHandler} style={{cursor: 'pointer'}}>
                <TableCell style={{maxWidth: '30vw'}}>{props.regionDayReport.region_name}</TableCell>
                {
                    columns.map(c =>
                        <TableCell key={c.dataKey} style={{maxWidth: '20vw'}}>{props.regionDayReport[c.dataKey]}</TableCell>
                    )
                }
            </TableRow>
        </React.Fragment>
    )
});


export function LatestTableBody (props){
    const searchText = useSelector(state => (state[props.reducerKey].searchText));
    const reports = useSelector(state => (state[props.reducerKey].reports));
    useEffect(() => forceCheck());
    return <TableBody>
        {
            reports.map(
                (value) =>
                    (
                        value.region_name.toLowerCase().includes(searchText.toLowerCase()) ?
                            <LazyLoad height={50} once>
                            <MainTableRow reducerKey={props.reducerKey} regionDayReport={value} key={value.region_id} settings={props.settings}/>
                            </LazyLoad>
                            :
                            null
                    )
            )
        }
    </TableBody>
};