import {LineChart} from "recharts";
import Line from "recharts/lib/cartesian/Line";
import BarChart from "recharts/lib/chart/BarChart";
import Bar from "recharts/lib/cartesian/Bar";
import AreaChart from "recharts/lib/chart/AreaChart";
import Area from "recharts/lib/cartesian/Area";
import purple from "@material-ui/core/colors/purple";
import grey from "@material-ui/core/colors/grey";
import green from "@material-ui/core/colors/green";






const globalSettings = {
    reportType: 'global',
    reducerKey: 'globalReports',
    regionLabel: "Kraj",
    map: {
        enableZoom: true,
        projectionConfig: {
            scale: 140,
        }
    },
    detail: [
        {
            title: "Łącznie",
            component: LineChart,
            series: [
                {component: Line, name: "Zachorowania", dataKey: "total_cases", stroke: "#8884d8"},
                {component: Line, name: "Zgony", dataKey: "total_deaths", stroke: "#000000"},
                {component: Line, name: "Wyzdrowienia", dataKey: "total_recoveries", stroke: "#56e336"},
            ]
        },
        {
            title: "Aktywne",
            component: AreaChart,
            series: [
                {component: Area, name: "Liczba chorych", dataKey: "active_cases", stroke: "#6ec5d8"},
            ]
        },
        {
            title: "Dzienny przyrost",
            component: BarChart,
            series: [
                {component: Bar, name: "Przyrost zachorowań", dataKey: "total_cases_delta", stroke: "#d89267"},
            ]
        },
    ],
    columns: [
        {name: "Zachorowania", dataKey: "total_cases", color: purple[500]},
        {name: "Zgony", dataKey: "total_deaths", color: '#333'},
        {name: "Wyzdrowienia", dataKey: "total_recoveries", color: green[500]},
    ]
};


const localSettings = {
    reportType: 'local',
    reducerKey: 'localReports',
    regionLabel: "Województwo",
    map: {
        enableZoom: false,
        projection: "geoAzimuthalEqualArea",
        projectionConfig: {
            rotate: [-20.0, -52.0, 0],
            scale: 5500,
            center: [-.5, -.02]
        }
    },
    detail: [
        {
            title: "Łącznie",
            component: LineChart,
            series: [
                {component: Line, name: "Zachorowania", dataKey: "total_cases", stroke: "#8884d8"},
                {component: Line, name: "Zgony", dataKey: "total_deaths", stroke: "#000000"},
            ],
        },
        {
            title: "Dzienny przyrost",
            component: BarChart,
            series: [
                {component: Bar, name: "Przyrost zachorowań", dataKey: "total_cases_delta", stroke: "#d89267"},
            ]
        },
    ],
    columns: [
        {name: "Zachorowania", dataKey: "total_cases", color: purple[500]},
        {name: "Zgony", dataKey: "total_deaths", color: '#333'},
    ]
};


export const reportTypeSettings = {
    global: globalSettings,
    local: localSettings
};