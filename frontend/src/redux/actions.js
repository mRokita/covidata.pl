export const SET_REPORTS = 'SET_REPORTS';
export const SET_SEARCH_TEXT = 'SET_SEARCH_TEXT';


export const setReports = (reportType, reports) => ({
   type: reportType + '_' + SET_REPORTS,
   payload: reports
});

export const clearReports = (reportType) => setReports(reportType, []);

export const setSearchText = (reportType, searchText) => ({
    type: reportType + '_' + SET_SEARCH_TEXT,
    payload: searchText
});