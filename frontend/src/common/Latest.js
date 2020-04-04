import React from "react";
import {LatestFilterBox} from "./LatestFilterBox";
import TableContainer from "@material-ui/core/TableContainer";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import {LoadingCircle} from "../components/common/LoadingCircle";
import {useSelector} from "react-redux";
import {LatestTableBody} from "./LatestTableBody";
import {Alert} from "@material-ui/lab"
import Typography from "@material-ui/core/Typography";


const LatestChartsAlert = (props) => {
    const reportsLoaded = useSelector(state => state[props.reducerKey].reportsLoaded);
    if (!reportsLoaded) return null;
    return (
        <Alert severity="info" color="info" style={{marginTop: 20}}>
            Kliknij wiersz w tabeli, aby zobaczyć wykresy
        </Alert>
    );
};


const LatestTableHead = (props) => {
    return (
        <TableHead>
            <TableRow>
                <TableCell><Typography noWrap variant={"body2"}>{props.regionLabel}</Typography></TableCell>
                {
                    props.columns.map(c =>
                        <TableCell key={c.dataKey} style={{maxWidth: '15vw'}}><Typography noWrap variant={"body2"}>{c.name}</Typography></TableCell>
                    )
                }
            </TableRow>
        </TableHead>
    );
};


export const Latest = (props) => {
    const settings = props.settings;
    return (
        <React.Fragment>
            <LatestFilterBox reducerKey={settings.reducerKey} reportType={settings.reportType}/>
            <LatestChartsAlert reducerKey={settings.reducerKey}/>
            <TableContainer component={Paper} style={{marginTop: '20px'}}>
                <Table style={{maxWidth: '100%', maxHeight: '100vh'}} stickyHeader>
                    <LatestTableHead columns={settings.columns} regionLabel={settings.regionLabel}/>
                    <LatestTableBody settings={settings} reducerKey={settings.reducerKey}/>
                </Table>
            </TableContainer>
            <LoadingCircle reducerKey={settings.reducerKey}/>
        </React.Fragment>
    )
};