import {getData} from "../../../shared/api";
import {UNIVERSITY_BASE_ROUTE} from "../../../shared/consts";
import {UniversityDTO} from "../models/universityDTO";

export const fetchAllUniversities = async () => {
    return (await getData<UniversityDTO[]>(UNIVERSITY_BASE_ROUTE))?.data
}