import { combineReducers } from "redux";
import globalReportsReducer from "./globalReportsReducer";

const rootReducer = combineReducers({
    globalReports: globalReportsReducer
});

export default rootReducer;
