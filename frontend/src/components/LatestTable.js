import AutoSizer from "react-virtualized/dist/commonjs/AutoSizer";
import Table from "react-virtualized/dist/commonjs/Table";
import {Column} from "react-virtualized"
import React, {useMemo, useRef} from "react";
import {useSelector} from "react-redux";
import TableCell from "@material-ui/core/TableCell";
import WindowScroller from "react-virtualized/dist/commonjs/WindowScroller";
import {Redirect, useLocation, useHistory, Route, useParams} from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import {useWindowWidth} from "@react-hook/window-size";
import {useRouteMatch} from "react-router-dom";
const cellRenderer = ({cellData, columnIndex, style}) => {
    return (
        <TableCell
            align="left"
            component="div"
            style={{...style, display: 'block'}}
            variant="body">
            {columnIndex === 0 ? <Typography noWrap variant={"body2"}>{cellData}</Typography> : cellData}
        </TableCell>
    );
};

const headerRenderer = ({label, columnIndex}) => {
    return (
        <TableCell
            align="left"
            style={{display: 'block'}}
            component="div"
            variant="head">
            <Typography noWrap variant={"body2"}>{label}</Typography>
        </TableCell>
    );
};

export default function LatestTable({settings}) {
    const {columns, reducerKey, regionLabel} = settings;
    const searchText = useSelector(state => (state[reducerKey].searchText));
    const reports = useSelector(state => (state[reducerKey].reports));
    const {url} = useRouteMatch();
    const history = useHistory();
    const table = useRef(null);
    const windowWidth = useWindowWidth();
    const filteredReports = useMemo(() => reports.filter(
        ({region_name}) => region_name.toLowerCase().includes(searchText.toLowerCase())
    ), [reports, searchText]);
    const clickHandler = ({rowData}) => history.push(`${url}/${rowData.region_name}/${rowData.region_id}`);

    return <WindowScroller>
        {
            ({height, width, isScrolling, onChildScroll, scrollTop}) => (
                <AutoSizer disableHeight onResize={() => table.current.forceUpdateGrid()}>
                    {
                        ({width}) =>
                            <Table
                                rowStyle={{
                                    cursor: 'pointer',
                                    flexDirection: 'row',
                                    display: 'flex',
                                    borderBottom: "1px solid #eee"
                                }}
                                headerStyle={{
                                    cursor: 'initial',
                                    backgroundColor: '#fafafa'
                                }}
                                noRowsRenderer={() => <Typography align={"center"} style={{padding: 10}}>Brak wyników</Typography>}
                                autoHeight
                                ref={table}
                                onRowClick={clickHandler}
                                rowHeight={50}
                                isScrolling={isScrolling}
                                onScroll={onChildScroll}
                                scrollTop={scrollTop}
                                estimatedRowSize={50}
                                overscanRowCount={5}
                                rowCount={filteredReports.length}
                                rowGetter={({index}) => filteredReports[index]}
                                headerHeight={50}
                                width={width}
                                height={height}>
                                <Column
                                    minWidth={100}
                                    key={"region_name"}
                                    cellRenderer={cellRenderer}
                                    headerRenderer={headerRenderer}
                                    dataKey={"region_name"}
                                    width={140}
                                    flexGrow={1}
                                    label={regionLabel}
                                />
                                {columns.map(({name, dataKey}, index) => {
                                    if(index > 1 && windowWidth < 360) return null;
                                    return (
                                        <Column
                                            minWidth={80}
                                            width={130}
                                            maxWidth={130}
                                            key={dataKey}
                                            cellRenderer={cellRenderer}
                                            headerRenderer={headerRenderer}
                                            dataKey={dataKey}
                                            label={name}
                                        />
                                    );
                                })}
                            </Table>
                    }
                </AutoSizer>
            )}
    </WindowScroller>
}