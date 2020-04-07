import React from "react";
import Typography from "@material-ui/core/Typography";
import blue from "@material-ui/core/colors/blue";

export const Http404 = () => (
    <div style={{backgroundColor: blue[500], height: 'calc(100vh - 56px)'}}>
        <Typography align={'center'} style={{paddingTop: '15vh', color: blue[50]}} variant={"h1"}>404</Typography>
        <Typography align={'center'} style={{paddingTop: '10px', color: blue[50], paddingLeft: 30, paddingRight: 30}} variant={"h4"}>Nie znaleziono strony</Typography>
    </div>
);