import NavBar from "./components/navbar/navbar";
import GlobalSearch from "./components/globalSearch/globalSearch";
import {Col, Container, Row, Spinner} from "react-bootstrap";
import Tools from "./components/tools/tools";
import TableWithInfoAndSearch from "./components/table/tableWithInfoAndSearch";
import {createContext, useContext, useEffect, useState} from "react";
import {ProgramContext} from "./index";
import ApplicationStore from "./store/application";
import getAllUniversities from "./http/universityAPI"
import getAllStudyDirections from "./http/studyDirectionAPI"
import getAllPrograms from "./http/educationalProgramAPI"
import getAllCompetitions from "./http/competitionTypeAPI"
import getAllStudyModes from "./http/studyModeAPI"
import "./index.css"
import ApplicationInfoStore from "./store/applicationInfo";
import getAllCities from "./http/cityAPI";

export const ApplicationContext = createContext(null)
export const GlobalSearchContext = createContext(null)

const applicationStore = new ApplicationStore();
const applicationInfoStore = new ApplicationInfoStore();

export function App() {
    const {city, university, studyDirection, program, competition, studyMode} = useContext(ProgramContext)

    const [selectedOtherProgram, setSelectedOtherProgram] = useState(null);

    const [doHideEmptyOp, setDoHideEmptyOp] = useState(false);
    const [doHighlightAgreement, setDoHighlightAgreement] = useState(false);
    const [doHighlightDoc, setDoHighlightDoc] = useState(false);
    const [doHighlightManyAgreements, setDoHighlightManyAgreements] = useState(false);
    const [doHighlightGreaterSum, setDoHighlightGreaterSum] = useState(Number.MAX_SAFE_INTEGER);
    const [doHighlightLessSum, setDoHighlightLessSum] = useState(Number.MIN_SAFE_INTEGER);
    const [doHideGreaterSum, setDoHideGreaterSum] = useState(Number.MAX_SAFE_INTEGER);
    const [doHideLessSum, setDoHideLessSum] = useState(Number.MIN_SAFE_INTEGER);

    const [loading, setLoading] = useState(true)
    const [isSearchSet, setIsSearchSet] = useState(false);

    let citiesLoaded = false;
    let universitiesLoaded = false;
    let directionsLoaded = false;
    let programsLoaded = false;
    let competitionsLoaded = false;
    let studyModesLoaded = false;

    const trySetLoaded = () => {
        if (citiesLoaded && universitiesLoaded && directionsLoaded && programsLoaded && competitionsLoaded && studyModesLoaded) {
            setLoading(false);
        }
    }

    useEffect(() => {
        getAllCities().then(data => city.setCities(data)).finally(() => {
            citiesLoaded = true;
            trySetLoaded();
        })
        getAllUniversities().then(data => university.setUniversities(data)).finally(() => {
            universitiesLoaded = true;
            trySetLoaded()
        })
        getAllStudyDirections().then(data => studyDirection.setDirections(data)).finally(() => {
            directionsLoaded = true;
            trySetLoaded()
        })
        getAllPrograms().then(data => program.setPrograms(data)).finally(() => {
            programsLoaded = true;
            trySetLoaded()
        })
        getAllCompetitions().then(data => competition.setCompetitions(data)).finally(() => {
            competitionsLoaded = true;
            trySetLoaded()
        })
        getAllStudyModes().then(data => studyMode.setStudyModes(data)).finally(() => {
            studyModesLoaded = true;
            trySetLoaded()
        })
    }, [])

    if (loading) {
        return <div className="vh-100 d-flex justify-content-center"><Spinner animation="border"
                                                                              className="align-self-center"/></div>
    }

    return (
        <div>
            <NavBar/>
            <ApplicationContext.Provider value={{
                application: applicationStore,
                applicationInfo: applicationInfoStore,
                doHideEmptyOp: doHideEmptyOp,
                setDoHideEmptyOp: setDoHideEmptyOp,
                doHighlightAgreement: doHighlightAgreement,
                setDoHighlightAgreement: setDoHighlightAgreement,
                doHighlightDoc: doHighlightDoc,
                setDoHighlightDoc: setDoHighlightDoc,
                doHighlightManyAgreements: doHighlightManyAgreements,
                setDoHighlightManyAgreements: setDoHighlightManyAgreements,
                doHighlightGreaterSum: doHighlightGreaterSum,
                setDoHighlightGreaterSum: setDoHighlightGreaterSum,
                doHighlightLessSum: doHighlightLessSum,
                setDoHighlightLessSum: setDoHighlightLessSum,
                doHideGreaterSum: doHideGreaterSum,
                setDoHideGreaterSum: setDoHideGreaterSum,
                doHideLessSum: doHideLessSum,
                setDoHideLessSum: setDoHideLessSum
            }}>
                <GlobalSearchContext.Provider value={{
                    selectedOtherProgram: selectedOtherProgram,
                    setSelectedOtherProgram: setSelectedOtherProgram
                }}>
                    <GlobalSearch onFindClick={setIsSearchSet}/>
                    <Container>
                        {isSearchSet ?
                            <Row className="mt-4">
                                <Col xs={2}><Tools/></Col>
                                <Col><TableWithInfoAndSearch/></Col>
                            </Row>
                            : <div className="d-flex justify-content-center" style={{height: "71vh"}}><span
                                className="placeholderText">Задайте условия поиска</span></div>}
                    </Container>
                </GlobalSearchContext.Provider>
            </ApplicationContext.Provider>
        </div>
    );
}
