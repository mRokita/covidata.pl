import useTheme from "@material-ui/core/styles/useTheme";
import {useMediaQuery} from "@material-ui/core";
import ResponsiveContainer from "recharts/lib/component/ResponsiveContainer";
import CartesianGrid from "recharts/lib/cartesian/CartesianGrid";
import XAxis from "recharts/lib/cartesian/XAxis";
import YAxis from "recharts/lib/cartesian/YAxis";
import Tooltip from "recharts/lib/component/Tooltip";
import React, {useReducer} from "react";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Typography from "@material-ui/core/Typography";

const ResponsiveChart = (props) => {
    const theme = useTheme();
    const onMobile = useMediaQuery(theme.breakpoints.down('sm'));
    return (
        <ResponsiveContainer width="100%" height={onMobile ? 340 : 500}>
            <props.component data={props.data} margin={{right: 50, left: 0, bottom: 0, top: 30}}>
                <CartesianGrid strokeDasharray="5 5"/>
                <XAxis dataKey={"date"}/>
                <YAxis/>
                <Tooltip/>
                {props.children}
            </props.component>
        </ResponsiveContainer>
    );
};

const reducer = (state, action) => {
    switch (action.type) {
        case 'toggle':
            if (state.includes(action.dataKey))
                return state.filter((i) => i !== action.dataKey);
            else
                return [...state, action.dataKey];
        default:
            throw new Error("Invalid arguments");
    }
};

export const CardChart = (props) => {
    const [disabledSeries, dispatch] = useReducer(reducer, []);
    return (
        <Box boxShadow={3} style={{padding: '10px'}}>
            <Typography variant="h5" align="center" style={{paddingTop: 20}}>
                {props.title}
            </Typography>
            <ResponsiveChart component={props.component} data={props.data}>
                {
                    props.children.map(c => disabledSeries.includes(c.props.dataKey) ? null : c)
                }
            </ResponsiveChart>
            <Grid container
                  direction="column"
                  alignItems="center"
                  justify="center"
                  style={{padding: 20, width: '100%'}}>
                {   props.children.length > 1 ?
                    props.children.map(c =>
                        <Grid item xs={12} key={c.props.dataKey}>
                            <FormControlLabel
                                control={
                                    <Checkbox style={{color: c.props.stroke}}
                                              name={c.props.name}
                                              onChange={() => dispatch({type: 'toggle', dataKey: c.props.dataKey})}
                                              checked={!disabledSeries.includes(c.props.dataKey)}
                                    />
                                }
                                label={c.props.name}
                            />
                        </Grid>
                    ) : null
                }
            </Grid>
        </Box>
    );
};