import {SET_REPORTS, SET_SEARCH_TEXT} from "../actions";


const initState = {
    searchText: '',
    reports: [],
    reportsLoaded: false,
};


const reportsReducer = (reportType) => (state = initState, action) => {
    switch (action.type) {
        case reportType + '_' + SET_REPORTS:
            return {
                ...state,
                reports: action.payload,
                reportsLoaded: action.payload.length
            };
        case reportType + '_' + SET_SEARCH_TEXT:
            return {
                ...state,
                searchText: action.payload
            };
        default:
            return state;
    }
};

export default reportsReducer
