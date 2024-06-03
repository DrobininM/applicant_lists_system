import {getData} from "../../../shared/api";
import {COMPETITION_TYPE_BASE_ROUTE} from "../../../shared/consts";
import {CompetitionTypeDTO} from "../models/competitionTypeDTO";

export const fetchAllCompetitionTypes = async () => {
    return (await getData<CompetitionTypeDTO[]>(COMPETITION_TYPE_BASE_ROUTE))?.data
}