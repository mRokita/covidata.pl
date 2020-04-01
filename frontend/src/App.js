import React, {useContext, useEffect, useState} from 'react';
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
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import {useDispatch, useSelector} from "react-redux";
import {setGlobalReports, setSearchText} from "./redux/actions";


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
    let drp = props.regionDayReport;
    return (
        <TableRow key={drp.region_id}>
            <TableCell style={{maxWidth: '30vw'}}>{drp.region_name}</TableCell>
            <TableCell style={{maxWidth: '20vw'}}>{drp.total_cases}</TableCell>
            <TableCell style={{maxWidth: '20vw'}}>{drp.total_recoveries}</TableCell>
            <TableCell style={{maxWidth: '20vw'}}>{drp.total_deaths}</TableCell>
        </TableRow>
    )
};


let RegionsTableBody = () => {
    const dispatch = useDispatch();
    const searchText = useSelector(state => state.globalReports.searchText);
    const reports = useSelector(state => state.globalReports.reports);
    useEffect(() => {
        axios.get(API_URL + 'latest_day_reports')
            .then((response) => {
                dispatch(setGlobalReports(response.data))
            })
    }, []);
    return <React.Fragment>
        {
            reports.map(
                (value) =>
                    (
                        value.region_name.toLowerCase().includes(searchText.toLowerCase()) ?
                        <RegionsTableRow regionDayReport={value} key={value.region_id}/>
                        :
                        null
                    )
            )
        }
    </React.Fragment>
};


const FilterBox = () => {
    const dispatch = useDispatch();
    const searchText = useSelector(state => state.globalReports.searchText);
    return (
        <Grid xs={12} style={{paddingTop: '20px'}}>
            <Grid xs={12} item>
                <form noValidate autoComplete={"off"}>
                    <TextField label="Szukaj"
                               value={searchText}
                               onChange={
                                       e => dispatch(setSearchText(e.target.value))
                               }
                               variant="outlined"
                               style={{width: '100%'}}/>
                </form>
            </Grid>
        </Grid>
    );
};


const LoadingCircle = () => {
    const classes = useStyles();
    const reportsLoaded = useSelector(state => state.globalReports.reportsLoaded);
    if (reportsLoaded) return null;
    return (
        <Grid container xs={12} justify={'center'} className={classes.root} style={{padding: '20px'}}>
            <CircularProgress/>
        </Grid>
    )
};

function App() {
    const classes = useStyles();
    return (
        <React.Fragment>
            <CssBaseline/>
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
                        <MenuIcon/>
                    </IconButton>
                    <Typography variant="h6" className={classes.title}>
                        covidata.pl
                    </Typography>
                </Toolbar>
            </AppBar>
            <Container component={Paper}>
                <FilterBox/>
                <TableContainer component={Paper} style={{marginTop: '20px', marginBottom: '20px', maxHeight: '100vh'}}>
                    <Table style={{maxWidth: '100%'}} stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell>Kraj</TableCell>
                                <TableCell style={{maxWidth: '25vw'}}>Zachor.</TableCell>
                                <TableCell style={{maxWidth: '25vw'}}>Wyzdr.</TableCell>
                                <TableCell style={{maxWidth: '20vw'}}>Zgony</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <RegionsTableBody/>
                        </TableBody>
                    </Table>
                </TableContainer>
                <LoadingCircle/>
            </Container>
        </React.Fragment>
    );
}

export default App;
