import Search, {searchOptions} from "../search/search";
import Table from "./table";
import {createContext, useContext, useState} from "react";
import {ApplicationContext} from "../../App";
import {observer} from "mobx-react-lite";
import {ProgramContext} from "../../index";
import Select from "react-select";

export const SearchContext = createContext(null);

const useApplicationContext = () => useContext(ApplicationContext);
const useProgramContext = () => useContext(ProgramContext);

const convertTwoDatesToRange = (startDate, endDate) => {
    const start = convertDate(startDate);

    if (!endDate) {
        return start + " - ...";
    }

    return start + " - " + convertDate(endDate);
}

const convertDate = (date) => {
    const month = new Intl.DateTimeFormat('ru', { month: 'short' }).format(date);
    const year = new Intl.DateTimeFormat('ru', { year: 'numeric' }).format(date);

    return month + " " + year;
}

const TableWithInfoAndSearch = observer(() => {
    const {applicationInfo} = useApplicationContext();
    const {city, university, studyDirection, program} = useProgramContext();

    const [searchText, setSearchText] = useState('');
    const [searchOptionId, setSearchOptionId] = useState(searchOptions[0].value);

    const smallTextStyle = {fontSize: "12px", fontFamily: "sans-serif"};

    const getTitleText = () => {
        return university.selectedUniversityName + " (" + city.selectedCityName + "), " + studyDirection.selectedDirectionName + " " + program.selectedProgramName;
    }

    const getInfoText = () => {
        let text = "Кол-во бюджетных мест: " + applicationInfo.info.application.budget_seats;
        text += "; Кол-во коммерческих мест: " + applicationInfo.info.application.commercial_seats;
        text += "; Кол-во целевых мест: " + applicationInfo.info.application.targeted_seats;
        text += "; ";

        return text;
    }

    const getDatesText = () => {
        let text = "; ";
        //text += "Дата формирования " + getParsedDateString(applicationInfo.info.application.last_check_date)
        text += "Дата последней проверки: " + getParsedDateString(applicationInfo.info.application.last_check_date)

        return text;
    }

    const getParsedDateString = (dateString) => {
        return new Date(dateString).toLocaleString("ru-RU");
    }

    if (!applicationInfo.info) {
        return <div></div>
    }

    return (
        <div className="d-flex flex-column align-items-center">
            <div className="mb-1">
                <span>{getTitleText()}</span>
            </div>
            <div className="float-start mb-3">
                <span style={smallTextStyle}>{getInfoText()}</span>
                {applicationInfo.info.application.application_link ? <>
                <a href={applicationInfo.info.application.application_link} style={smallTextStyle}>Оригинальный список</a>
                <span style={smallTextStyle}>{getDatesText()}</span></> : <></> }
            </div>
            <SearchContext.Provider value={{
                searchText: searchText,
                setSearchText: setSearchText,
                searchOptionId: searchOptionId,
                setSearchOptionId: setSearchOptionId
            }}>
                <div style={{display: "flex", width: "100%", marginBottom: "10px"}}>
                    <div style={{flex: "0.5", display: "flex", justifyItems: "left", paddingLeft: "5px"}}>
                        <Select placeholder={"Укажите период поступления"}
                                value={{label: "июнь 2024 - ...", value: 1}}
                                isClearable={false}></Select>
                    </div>

                    <div style={{flex: "1", display: "flex", justifyContent: "center"}}>
                        <Search/>
                    </div>

                    <div style={{flex: "0.5"}}></div>
                </div>

                <Table/>
            </SearchContext.Provider>
        </div>
    )
})

export default TableWithInfoAndSearch;