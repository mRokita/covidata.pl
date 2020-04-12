import {Latest} from "./Latest";
import React from "react";
import {DetailModal} from "./common/DetailModal";
import ReportsProvider from "./common/ReportsProvider";


export default function Stats(){
    return <ReportsProvider urlPrefix={"/stats"} modalComponent={DetailModal}>
        <Latest/>
    </ReportsProvider>
}