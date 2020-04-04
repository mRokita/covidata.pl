import React, {useEffect, useState} from "react";
import useTheme from "@material-ui/core/styles/useTheme";
import {API_URL} from "../index";
import {useMediaQuery} from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import Grow from "@material-ui/core/Grow";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import DialogContent from "@material-ui/core/DialogContent";
import Box from "@material-ui/core/Box";
import ResponsiveContainer from "recharts/lib/component/ResponsiveContainer";
import LineChart from "recharts/lib/chart/LineChart";
import CartesianGrid from "recharts/lib/cartesian/CartesianGrid";
import XAxis from "recharts/lib/cartesian/XAxis";
import YAxis from "recharts/lib/cartesian/YAxis";
import Tooltip from "recharts/lib/component/Tooltip";
import Line from "recharts/lib/cartesian/Line";
import Grid from "@material-ui/core/Grid";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import purple from "@material-ui/core/colors/purple";
import axios from "axios";
import makeStyles from "@material-ui/core/styles/makeStyles";

const useStyles = makeStyles(theme => ({
    detailToolbar: {
        background: purple[800],
        color: 'white'
    },
    title: {
        flexGrow: 1,
    },
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
}));


export const GlobalDetailModal = (props) => {
    const classes = useStyles();
    const [data, setData] = useState([]);
    const [showCases, setShowCases] = useState(true);
    const toggleCases = () => setShowCases(!showCases);
    const [showDeaths, setShowDeaths] = useState(true);
    const toggleDeaths = () => setShowDeaths(!showDeaths);
    const [showRecoveries, setShowRecoveries] = useState(true);
    const toggleRecoveries = () => setShowRecoveries(!showRecoveries);
    const drp = props.regionDayReport;
    const theme = useTheme();
    useEffect(() => {
        axios.get(API_URL + 'regions/' + drp.region_id + '/day_reports')
            .then((response) => {
                setData(response.data);
            })
    }, [drp.region_id, props.show]);

    const onMobile = useMediaQuery(theme.breakpoints.down('sm'));
    return (
        <Dialog open={props.show} fullScreen onClose={props.onClose} TransitionComponent={Grow}>
            <AppBar position="static">
                <Toolbar className={classes.detailToolbar}>
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
                    <ResponsiveContainer width="100%" height={onMobile ? 340 : 500}>
                        <LineChart data={data} margin={{right: 50, left: 0, bottom: 0, top: 50}}>
                            <CartesianGrid strokeDasharray="3 3"/>
                            <XAxis dataKey={"date"}/>
                            <YAxis/>
                            <Tooltip/>
                            {showCases ? <Line type="monotone" name="Łączna liczba zachorowań" dataKey="total_cases"
                                               stroke="#8884d8"/> : null}
                            {showDeaths ? <Line type="monotone" name="Łączna liczba zgonów" dataKey="total_deaths"
                                                stroke="#000000"/> : null}
                            {showRecoveries ?
                                <Line type="monotone" name="Łączna liczba wyzdrowień" dataKey="total_recoveries"
                                      stroke="#56e336"/> : null}
                        </LineChart>
                    </ResponsiveContainer>
                    <Grid container direction="column"
                          alignItems="center"
                          justify="center"
                          style={{padding: 20, width: '100%'}}>
                        <Grid item xs={4}>
                            <FormControlLabel
                                control={<Checkbox checked={showCases} style={{color: "#8884d8"}} onChange={toggleCases}
                                                   name="Zachorowania"/>}
                                onChange={toggleCases}
                                label="Zachorowania"
                            />
                            <FormControlLabel
                                control={<Checkbox checked={showDeaths} style={{color: "#000000"}}
                                                   onChange={toggleDeaths} name="Zgony"/>}
                                label="Zgony"
                                onChange={toggleDeaths}
                            />
                            <FormControlLabel
                                control={<Checkbox checked={showRecoveries} style={{color: "#56e336"}}
                                                   onChange={toggleRecoveries} name="Wyzdrowienia"/>}
                                label="Wyzdrowienia"
                                onChange={toggleRecoveries}
                            />
                        </Grid>
                    </Grid>
                </Box>
            </DialogContent>
        </Dialog>
    );
};