import React, {useMemo} from "react";
import {ComposableMap, Geographies, Geography, Graticule, ZoomableGroup} from "react-simple-maps";
import ReportsProvider from "./common/ReportsProvider";
import {DetailModal} from "./common/DetailModal";
import {useHistory, useRouteMatch} from "react-router-dom";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import {useSelector} from "react-redux";
import {reportTypeSettings} from "../config";
import purple from "@material-ui/core/colors/purple";

export default function Maps() {
    return <ReportsProvider urlPrefix={"/maps"} modalComponent={DetailModal}>
        <Map/>
    </ReportsProvider>
}

var COLOR = purple;
function getScaleColors() {
    let colors = [];
    colors.push(...[50, 200, 300, 500, 700, 900].map(i => {
        return COLOR[i];
    }));
    return colors;
}

function getBreakpointForValue(breakpoints, cases) {
    for (let i = breakpoints.length; i >= 0; i--) {
        if (cases >= breakpoints[i]) {
            return i;
        }
    }
}

function stringifyBreakpoint(breakpoint) {
    if ((breakpoint / 1000000) >= 1) {
        return breakpoint / 1000000 + 'M'
    }
    if ((breakpoint / 1000) >= 1) {
        return breakpoint / 1000 + 'K'
    }
    return breakpoint;
}

function getLinearBreakpoints(max){
    let step = 100;
    let inc = 100;
    while (step * 6 < max) {
        step += inc;
        if (step === inc * 5) {
            inc = step;
        }
    }
    let breakpoints = [];
    for (let i = 0; i < 6; ++i) {
        breakpoints.push(step * i);
    }
    return breakpoints
}


function getExponentialBreakpoints(max){
    let step = 100;
    let inc = 100;
    while (step * (2**6) < max) {
        step += inc;
        if (step === inc * 5) {
            inc = step;
        }
    }
    let breakpoints = [0, 100];
    for (let i = 0; i < 4; ++i) {
        breakpoints.push(step * (2 ** i));
    }
    return breakpoints
}



function getBreakpointFunc(reports) {
    let max = 0;
    reports.forEach(
        (report) => max = max > report.total_cases ? max : report.total_cases
    );
    let breakpoints  = [];
    if(max < 100000) breakpoints = getLinearBreakpoints(max);
    else breakpoints = getExponentialBreakpoints(max);
    return [breakpoints, (val) => getBreakpointForValue(breakpoints, val)]
}

const Map = ({reportType}) => {
    const settings = reportTypeSettings[reportType];
    const {reducerKey, map} = settings;
    const reports = useSelector(state => (state[reducerKey].reports));
    const scaleColors = useMemo(getScaleColors, []);
    const [breakpoints, getBreakpoint] = useMemo(() => getBreakpointFunc(reports), [reports]);
    const reportMap = useMemo(() => {
        let obj = {};
        reports.forEach(report =>
            obj[report.region_name] = report
        );
        return obj;



    }, [reports]);
    if(!reports.length) return null;
    return <Container>
        <Grid container justify='center' style={{marginBottom: 20}}>
            <Grid item xl={8} xs={12} md={10}>
                <MapChart
                    mapConfig={map}
                    getBreakpoint={getBreakpoint}
                    reportMap = {reportMap}
                    reportType={reportType}
                    scaleColors={scaleColors} />
            </Grid>
        </Grid>
        <Grid container justify={'center'} style={{marginBottom: 20}}>
            {breakpoints.map((b, i) =>
                <Grid item xs={2} key={b}>
                    <div style={{backgroundColor: scaleColors[i], height: 14, margin: 2}}/>
                    <div
                        style={{padding: 4, textAlign: 'left', color: '#888', fontSize: '1em'}}>{stringifyBreakpoint(b)}+
                    </div>
                </Grid>
            )}
        </Grid>
    </Container>
};

const Region = ({geo, report, getColor}) => {
    const color = report ? getColor(report.total_cases) : COLOR[50];
    const {url} = useRouteMatch();
    const history = useHistory();
    const clickHandler = () => history.push(`${url}/${report.region_name}/${report.region_id}`);
    return (<Geography
            onClick={report ? clickHandler : null}
            key={geo.rsmKey}
            geography={geo}
            style={{
                default: {
                    stroke: color,
                    fill: color,
                    strokeWidth: 0,
                    outline: 'none'
                },
                hover: {
                    stroke: '#F53',
                    fill: color,
                    strokeWidth: report ? 1 : 0,
                    outline: 'none'
                },
                pressed: {
                    stroke: '#F53',
                    fill: color,
                    strokeWidth: report ? 1 : 0,
                    outline: 'none'
                }
            }}/>
    );
};

const MapChart = ({getBreakpoint, scaleColors, reportMap, reportType, mapConfig}) => {
    const {projection, projectionConfig} = mapConfig;
    const getColor = (cases) => scaleColors[getBreakpoint(cases)];
    const C = reportType === 'local' ? ({children}) => children : ZoomableGroup;
    return (
        <ComposableMap projection={projection}
                       projectionConfig={projectionConfig}>

            <C zoom={1} minZoom={1} maxZoom={10}>

                {reportType === 'global' ? <Graticule stroke={COLOR[50]}/>: null}
            <Geographies geography={`/map-${reportType}.json`}>
                {
                    ({geographies}) => geographies.map(geo => <Region geo={geo}
                                                                      key={geo.rsmKey}
                                                                      getColor={getColor}
                                                                      report={reportMap[geo.properties.name]} />
                    )
                }
            </Geographies>

            </C>
        </ComposableMap>
    )
};