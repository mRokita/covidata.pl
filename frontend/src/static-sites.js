import InfoIcon from "@material-ui/icons/Info";
import {AccountCircle, Book, ErrorSharp, LocalHospital, Report, Warning} from "@material-ui/icons";

const staticSites = [
    {
        url: "/podstawowe-informacje",
        title: "Podstawowe informacje o wirusie",
        description: "Podstawowe informacje o aktualnie trwającej pandemii wirusa SARS-CoV-2",
        icon: Book,
        "source": "/md/podstawowe-informacje.md"
    },
    {
        url: "/symptomy",
        title: "Symptomy",
        icon: LocalHospital,
        description: "Analiza choroby COVID-19, czyli to co powinieneś wiedzieć, by nie dać się zaskoczyć",
        "source": "/md/symptomy.md"
    },
    {
        url: "/zagrozenie-i-smiertelnosc",
        title: "Zagrożenie i śmiertelność",
        description: "Analiza zagrożeń zdrowotnych oraz prób estymacji współczynnika śmiertelności wirusa SARS-CoV-2",
        icon: Warning,
        "source": "/md/zagrozenie-i-smiertelnosc.md"
    },
    {
        url: "/mity",
        title: "Fakty, mity, ciekawostki",
        description: "Mit czy fakt? Miejsce na odpowiedź na najczęściej spotykane plotki o obecnej pandemii",
        icon: InfoIcon,
        "source": "/md/mity.md"
    },
    {
        url: "/about",
        title: "O nas",
        description: "covidata.pl - Koronawirus. Rzetelnie",
        icon: AccountCircle,
        "source": "/md/about.md"
    },
];
export default staticSites;