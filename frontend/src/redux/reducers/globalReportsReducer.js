import {SET_GLOBAL_REPORTS, SET_SEARCH_TEXT} from "../actions";


const initState = {
    searchText: '',
    reports: [],
    reportsLoaded: false,
};


const globalReportsReducer = (state = initState, action) => {
    switch (action.type) {
        case SET_GLOBAL_REPORTS:
            return {
                ...state,
                reports: action.payload,
                reportsLoaded: true
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
