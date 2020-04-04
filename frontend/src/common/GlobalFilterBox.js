import {useDispatch, useSelector} from "react-redux";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import {setSearchText} from "../redux/actions";
import React from "react";


export const GlobalFilterBox = () => {
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