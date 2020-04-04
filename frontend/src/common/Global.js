import React from "react";
import {GlobalFilterBox} from "./GlobalFilterBox";
import TableContainer from "@material-ui/core/TableContainer";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import {LoadingCircle} from "../components/common/LoadingCircle";
import {useSelector} from "react-redux";
import {GlobalTableBody} from "./GlobalTableBody";
import {Alert} from "@material-ui/lab"


const GlobalChartsAlert = () => {
    const reportsLoaded = useSelector(state => state.globalReports.reportsLoaded);
    if (!reportsLoaded) return null;
    return (
        <Alert severity="info" color="info" style={{marginTop: 20}}>
            Kliknij wiersz w tabeli, aby zobaczyć wykresy
        </Alert>
    );
};


const GlobalTableHead = () => {
    return (
        <TableHead>
            <TableRow>
                <TableCell>Kraj</TableCell>
                <TableCell style={{maxWidth: '25vw'}}>Zachor.</TableCell>
                <TableCell style={{maxWidth: '25vw'}}>Wyzdr.</TableCell>
                <TableCell style={{maxWidth: '20vw'}}>Zgony</TableCell>
            </TableRow>
        </TableHead>
    );
};


export const Global = () => {
    return (
        <React.Fragment>
            <GlobalFilterBox/>
            <GlobalChartsAlert/>
            <TableContainer component={Paper} style={{marginTop: '20px'}}>
                <Table style={{maxWidth: '100%', maxHeight: '100vh'}} stickyHeader>
                    <GlobalTableHead/>
                    <GlobalTableBody/>
                </Table>
            </TableContainer>
            <LoadingCircle/>
        </React.Fragment>
    )
};