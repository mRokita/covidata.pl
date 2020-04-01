import {SET_GLOBAL_REPORTS, SET_SEARCH_TEXT} from "../actions";


const initState = {
    searchText: '',
    reports: []
};


const globalReportsReducer = (state = initState, action) => {
    switch (action.type) {
        case SET_GLOBAL_REPORTS:
            return {
                ...state,
                records: action.payload,
            };
        case SET_SEARCH_TEXT:
            return {
                ...state,
                searchText: action.payload
            };
        default:
            return state;
    }
};

export default globalReportsReducer
