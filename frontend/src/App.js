import React, {useEffect, useState} from 'react';
import './App.css';
import {API_URL} from './index'
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import Toolbar from "@material-ui/core/Toolbar";
import AppBar from "@material-ui/core/AppBar";
import MenuIcon from "@material-ui/icons/Menu";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Container from "@material-ui/core/Container";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import TableHead from "@material-ui/core/TableHead";
import Table from "@material-ui/core/Table";
import TableContainer from "@material-ui/core/TableContainer";
import TableBody from "@material-ui/core/TableBody";
import Grid from "@material-ui/core/Grid";
import {CircularProgress} from "@material-ui/core";
const axios = require('axios').default;
const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },
}));


let RegionsTableRow = (props) => {
    const [dayReport, setDayReport] = useState();
    useEffect(() => {
        axios.get(API_URL + 'regions/' + props.region.id + '/day_reports/2020-03-29')
            .then((response) => {
                setDayReport(response.data);
            })
    }, [props.region]);
    return (
        <TableRow>
            <TableCell>{props.region.name}</TableCell>
            <TableCell>{dayReport ? dayReport.total_cases : ''}</TableCell>
            <TableCell>0</TableCell>
            <TableCell>0</TableCell>
        </TableRow>
    )
}


let RegionsTableBody = () => {
    const [regions, setRegions] = useState([]);
    useEffect(() => {
        axios.get(API_URL + 'regions')
            .then((response) => {
                setRegions(response.data);
            })
    }, []);
    return <React.Fragment>
        {
            regions.map(
                (value, index) => (
                    <RegionsTableRow region={value}/>
                )
            )
        }
    </React.Fragment>
};

function App() {
    const classes = useStyles();
    return (
        <React.Fragment>
            <CssBaseline/>
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" className={classes.title}>
                        covidata.pl
                    </Typography>
                </Toolbar>
            </AppBar>
            <Container>
                <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Kraj</TableCell>
                            <TableCell>Zachorowania</TableCell>
                            <TableCell>Wyzdrowienia</TableCell>
                            <TableCell>Zgony</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <RegionsTableBody/>
                    </TableBody>
                </Table>
                </TableContainer>
                <Grid container xs={12} justify={'center'} className={classes.root}>
                    <CircularProgress/>
                </Grid>
            </Container>

        </React.Fragment>
    );
}

export default App;
