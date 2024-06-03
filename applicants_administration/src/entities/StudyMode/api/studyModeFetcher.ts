import {getData} from "../../../shared/api";
import {STUDY_MODE_BASE_ROUTE} from "../../../shared/consts";
import {StudyModeDTO} from "../models/studyModeDTO";

export const fetchAllStudyModes = async () => {
    return (await getData<StudyModeDTO[]>(STUDY_MODE_BASE_ROUTE))?.data
}