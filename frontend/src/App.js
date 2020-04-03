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
import {CircularProgress, useMediaQuery} from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import {useDispatch, useSelector} from "react-redux";
import {setGlobalReports, setSearchText} from "./redux/actions";
import Dialog from "@material-ui/core/Dialog";
import CloseIcon from '@material-ui/icons/Close';
import purple from "@material-ui/core/colors/purple";
import Grow from "@material-ui/core/Grow";
import useTheme from "@material-ui/core/styles/useTheme";
import DialogContent from "@material-ui/core/DialogContent";
import Box from "@material-ui/core/Box";
import XAxis from "recharts/lib/cartesian/XAxis";
import CartesianGrid from "recharts/lib/cartesian/CartesianGrid";
import LineChart from "recharts/lib/chart/LineChart";
import YAxis from "recharts/lib/cartesian/YAxis";
import Tooltip from "recharts/lib/component/Tooltip";
import Line from "recharts/lib/cartesian/Line";
import Legend from "recharts/lib/component/Legend";
import ResponsiveContainer from "recharts/lib/component/ResponsiveContainer";


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
    detailtoolbar: {
        background: purple[800],
        color: 'white'
    },
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
}));

let RegionDetailModal = (props) => {
    const classes = useStyles();
    const [data, setData] = useState([]);
    const drp = props.regionDayReport;
    const theme = useTheme();
    useEffect(() => {
        if(data.length) return;
        console.log('load');
        axios.get(API_URL + 'regions/' + drp.region_id + '/day_reports')
            .then((response) => {
                setData(response.data);
            })
    }, [props.show]);

    const onMobile = useMediaQuery(theme.breakpoints.down('sm'));
    return (
        <Dialog open={props.show} fullScreen onClose={props.onClose} TransitionComponent={Grow}>
            <AppBar position="static">
                <Toolbar className={classes.detailtoolbar}>
                    <Typography variant="h6" className={classes.title}>
                        {drp.region_name}
                    </Typography>
                    <IconButton edge="end" color="inherit" onClick={props.onClose} aria-label="close">
                        <CloseIcon/>
                    </IconButton>
                </Toolbar>
            </AppBar>
            <DialogContent style={{padding: '20px'}}>
                <Typography variant="h6" style={{marginBottom: 20}}>
                    Statystyki
                </Typography>
                <Box boxShadow={3} style={{padding: '10px'}}>
                    <ResponsiveContainer width="100%" height={500}>
                        <LineChart data={data} margin={{right: 50, left: 0, bottom: 0, top: 0}}>
                        <CartesianGrid strokeDasharray="3 3"/>
                        <XAxis dataKey={"date"}/>
                        <YAxis/>
                        <Tooltip/>
                        <Legend />
                        <Line type="monotone" name="Łączna liczba zachorowań" dataKey="total_cases" stroke="#8884d8" />
                        <Line type="monotone" name="Łączna liczba zgonów" dataKey="total_deaths" stroke="#000000" />
                        <Line type="monotone" name="Łączna liczba wyzdrowień" dataKey="total_recoveries" stroke="#56e336" />

                        </LineChart>
                    </ResponsiveContainer>

                </Box>
            </DialogContent>
        </Dialog>
    );
};


let RegionsTableRow = (props) => {
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
            <RegionDetailModal show={selected} onClose={() => setSelected(false)} regionDayReport={drp}/>
        </React.Fragment>
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
        <Grid xs={12}>
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
            <Container component={Paper} style={{paddingTop: '20px', paddingBottom: '20px'}}>
                <FilterBox/>
                <TableContainer component={Paper} style={{marginTop: '20px'}}>
                    <Table style={{maxWidth: '100%', maxHeight: '100vh'}} stickyHeader>
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
