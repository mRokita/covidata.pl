import { combineReducers } from "redux";
import reportsReducer from "./reportsReducer";

const rootReducer = combineReducers({
    globalReports: reportsReducer('global'),
    localReports: reportsReducer('local')
});

export default rootReducer;
