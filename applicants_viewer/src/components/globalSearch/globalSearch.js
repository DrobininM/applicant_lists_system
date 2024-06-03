import "../styles.css"
import "./style.css"
import {Button, Col, Container, Form, Row} from "react-bootstrap";
import React, {useContext, useEffect, useState} from "react";
import Select from "react-select";
import {ProgramContext} from "../../index";
import {ApplicationContext, GlobalSearchContext} from "../../App";
import {getAllApplications, getApplicationInfo, getLastApplication} from "../../http/applicationAPI";

export default function GlobalSearch(props) {
    const {city, university, studyDirection, program, competition, studyMode} = useContext(ProgramContext)
    const {application, applicationInfo} = useContext(ApplicationContext)
    const {selectedOtherProgram, setSelectedOtherProgram} = useContext(GlobalSearchContext)

    const noOptionsMessage = () => 'Нет результатов';

    const cityOptions = city.cities.map(city => {return {value: city.city_id, label: city.city_name}});
    const [universityOptions, setUniversityOptions] = useState(null);
    const [directionOptions, setDirectionOptions] = useState(null)
    const [programOptions, setProgramOptions] = useState(null)
    const [competitionOptions, setCompetitionOptions] = useState(null)
    const [studyModeOptions, setStudyModeOptions] = useState(null)

    const [areUniversitiesBlocked, setAreUniversitiesBlocked] = useState(true)
    const [areDirectionsBlocked, setAreDirectionsBlocked] = useState(true)
    const [areProgramsBlocked, setAreProgramsBlocked] = useState(true)
    const [areCompetitionsBlocked, setAreCompetitionsBlocked] = useState(true)
    const [areStudyModesBlocked, setAreStudyModesBlocked] = useState(true)

    const [cityValue, setCityValue] = useState(null)
    const [universityValue, setUniversityValue] = useState(null)
    const [directionValue, setDirectionValue] = useState(null)
    const [programValue, setProgramValue] = useState(null)
    const [competitionValue, setCompetitionValue] = useState(null)
    const [studyModeValue, setStudyModeValue] = useState(null)

    const [isFindEnabled, setIsFindEnabled] = useState(false);

    const findOptionById = (options, id) => {
        for (let i = 0; i < options.length; i++) {
            if (options[i].value.toString() === id.toString()) {
                return options[i];
            }
        }
    }

    const onCityChanged = (selected) => {
        setCityValue(null);
        clearAndBlockUniversities();
        clearAndBlockDirections();
        clearAndBlockPrograms();
        clearAndBlockStudyModes();
        clearAndBlockCompetitions();
        setIsFindEnabled(false);

        if (!selected) {
            return;
        }

        city.setSelectedCityId(selected.value);
        city.setSelectedCityName(selected.label);

        university.setFilteredUniversities(selected.value);
        let filtered = university.filteredUniversities;
        setUniversityOptions(filtered.map(sd => {return {value: sd.university_id, label: sd.university_name}}))
        setCityValue(selected);
        setAreUniversitiesBlocked(false);
    }

    const onUniversityChanged = (selected) => {
        setUniversityValue(null);
        clearAndBlockDirections();
        clearAndBlockPrograms();
        clearAndBlockStudyModes();
        clearAndBlockCompetitions();
        setIsFindEnabled(false);

        if (!selected) {
            return;
        }

        university.setSelectedUniversityId(selected.value);
        university.setSelectedUniversityName(selected.label);

        studyDirection.setFilteredStudyDirections(selected.value)
        let filtered = studyDirection.filteredStudyDirections

        setDirectionOptions(filtered.map(sd => {return {value: sd.direction_id, label: sd.direction_name}}))

        setUniversityValue(selected);
        setAreDirectionsBlocked(false);
    }

    const onDirectionChanged = (selected) => {
        setDirectionValue(null);
        clearAndBlockPrograms();
        clearAndBlockStudyModes();
        clearAndBlockCompetitions();
        setIsFindEnabled(false);

        if (!selected) {
            return;
        }

        studyDirection.setSelectedDirectionId(selected.value);
        studyDirection.setSelectedDirectionName(selected.label);

        program.setFilteredPrograms(university.selectedUniversityId, selected.value)
        let filtered = program.filteredPrograms
        setProgramOptions(filtered.map(p => {return {value: p.program_id, label: p.program_name}}))

        setDirectionValue(selected);
        setAreProgramsBlocked(false);
    }

    const onProgramChanged = (selected) => {
        setProgramValue(null);
        clearAndBlockStudyModes();
        clearAndBlockCompetitions();
        setIsFindEnabled(false);

        if (!selected) {
            return;
        }

        program.setSelectedProgramId(selected.value);
        program.setSelectedProgramName(selected.label);

        studyMode.setFilteredStudyModes(university.selectedUniversityId, studyDirection.selectedDirectionId, selected.value)
        let filtered = studyMode.filteredStudyModes
        setStudyModeOptions(filtered.map(c => {return {value: c.mode_id, label: c.mode_name}}))

        setProgramValue(selected);
        setAreStudyModesBlocked(false);
    }

    const onStudyModeChanged = (selected) => {
        setStudyModeValue(selected);
        clearAndBlockCompetitions();
        setIsFindEnabled(false);

        if (!selected) {
            return;
        }

        studyMode.setSelectedStudyModeId(selected.value)
        competition.setFilteredCompetitions(university.selectedUniversityId, studyDirection.selectedDirectionId, program.selectedProgramId, selected.value)
        let filtered = competition.filteredCompetitions
        setCompetitionOptions(filtered.map(sm => {return {value: sm.type_id, label: sm.type_name}}))

        setAreCompetitionsBlocked(false);
    }

    const onCompetitionChanged = (selected) => {
        setCompetitionValue(null);
        setIsFindEnabled(false);

        if (!selected) {
            return;
        }

        competition.setSelectedCompetitionId(selected.value);

        setCompetitionValue(selected);

        setIsFindEnabled(true);
    }

    const clearAndBlockUniversities = () => {
        setUniversityValue(null);
        setAreDirectionsBlocked(true);
    }

    const clearAndBlockDirections = () => {
        setDirectionValue(null);
        setAreDirectionsBlocked(true);
    }

    const clearAndBlockPrograms = () => {
        setProgramValue(null);
        setAreProgramsBlocked(true);
    }

    const clearAndBlockCompetitions = () => {
        setCompetitionValue(null);
        setAreCompetitionsBlocked(true);
    }

    const clearAndBlockStudyModes = () => {
        setStudyModeValue(null);
        setAreStudyModesBlocked(true);
    }

    const doFindApplications = async () => {
        let universityId = university.selectedUniversityId;
        let directionId = studyDirection.selectedDirectionId;
        let programId = program.selectedProgramId;
        let competitionId = competition.selectedCompetitionId;
        let studyModeId = studyMode.selectedStudyModeId;

        let applications = await getLastApplication(universityId, directionId, programId, competitionId, studyModeId)
        application.setApplications(convertToOld(applications.application_rows, applications.application.application.subject_list.map(dto => dto.subject_name)))
        applicationInfo.setInfo(applications.application)

        props.onFindClick(true);
    }

    useEffect(() => {
    if (selectedOtherProgram && universityValue && universityValue.value.toString() !== selectedOtherProgram.universityId.toString()) {
        const {universityId, directionId, programId, competitionId, studyModeId} = selectedOtherProgram;
        onUniversityChanged(findOptionById(universityOptions, universityId))
        onDirectionChanged(findOptionById(directionOptions, directionId))
        onProgramChanged(findOptionById(programOptions, programId))
        onCompetitionChanged(findOptionById(competitionOptions, competitionId))
        onStudyModeChanged(findOptionById(studyModeOptions, studyModeId))

        //setSelectedOtherProgram(null)

        doFindApplications()
    }}, [selectedOtherProgram])

    return (
        <div className="main_color box d-flex align-items-center">
            <Container>
                <Form>
                    <Row >
                        <Col xs={4}>
                            <Select options={cityOptions}
                                    placeholder="Город"
                                    isClearable={true}
                                    noOptionsMessage={noOptionsMessage}
                                    value={cityValue}
                                    onChange={onCityChanged} />

                            <Select options={programOptions}
                                    placeholder="Образовательная программа"
                                    isClearable={true}
                                    noOptionsMessage={noOptionsMessage}
                                    isDisabled={areProgramsBlocked}
                                    className="mt-2"
                                    value={programValue}
                                    onChange={onProgramChanged} />
                        </Col>
                        <Col xs={3}>
                            <Select options={universityOptions}
                                    placeholder="Университет"
                                    isClearable={true}
                                    isDisabled={areUniversitiesBlocked}
                                    noOptionsMessage={noOptionsMessage}
                                    value={universityValue}
                                    onChange={onUniversityChanged} />

                            <Select options={studyModeOptions}
                                    placeholder="Формат обучения"
                                    isClearable={true}
                                    noOptionsMessage={noOptionsMessage}
                                    isDisabled={areStudyModesBlocked}
                                    value={studyModeValue}
                                    className="mt-2"
                                    onChange={onStudyModeChanged}/>
                        </Col>
                        <Col xs={4}>
                            <Select options={directionOptions}
                                    placeholder="Направление"
                                    isClearable={true}
                                    noOptionsMessage={noOptionsMessage}
                                    isDisabled={areDirectionsBlocked}
                                    value={directionValue}
                                    onChange={onDirectionChanged} />

                            <Select options={competitionOptions}
                                    placeholder="Тип конкурса"
                                    isClearable={true}
                                    noOptionsMessage={noOptionsMessage}
                                    isDisabled={areCompetitionsBlocked}
                                    value={competitionValue}
                                    className="mt-2"
                                    onChange={onCompetitionChanged} />
                        </Col>
                        <Col xs={1} className="d-flex align-items-center">
                            <Button style={{background: "#ff6c34", width: "100px", padding: "7px"}}
                            onClick={doFindApplications} disabled={!isFindEnabled}>Поиск</Button>
                        </Col>
                    </Row>
                </Form>
            </Container>
        </div>
    )
}

const convertToOld = (applicationRows, subject_name_list) => {
    const position_list = applicationRows.map(ap => ap.competitive_position);
    const insurance_number_list = applicationRows.map(ap => ap.insurance_number);
    const list_of_subject_values = applicationRows.map(ap => ap.scores.map(score => score.score));
    const extra_score_list = applicationRows.map(ap => ap.extra_score);
    const agreement_list = applicationRows.map(ap => ap.has_agreement);
    const priority_list = applicationRows.map(ap => ap.priority);
    const original_document_list = applicationRows.map(ap => ap.submitted_diploma);
    const has_special_right_list = applicationRows.map(ap => ap.has_special_right);
    const list_of_other_programs = []//applicationRows.map(ap => ap.list_of_other_programs[i])
    return {
        position_list: position_list,
        insurance_number_list: insurance_number_list,
        list_of_subject_values: list_of_subject_values,
        extra_score_list: extra_score_list,
        agreement_list: agreement_list,
        priority_list: priority_list,
        subject_name_list: subject_name_list,
        original_document_list: original_document_list,
        has_special_right_list: has_special_right_list,
        list_of_other_programs: list_of_other_programs,
    }
}