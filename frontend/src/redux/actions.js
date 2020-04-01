export const SET_GLOBAL_REPORTS = 'SET_GLOBAL_REPORTS';
export const SET_SEARCH_TEXT = 'SET_SEARCH_TEXT';


export const setGlobalReports = records => ({
   type: SET_GLOBAL_REPORTS,
   payload: records
});


export const setSearchText = searchText => ({
    type: SET_SEARCH_TEXT,
    payload: searchText
});