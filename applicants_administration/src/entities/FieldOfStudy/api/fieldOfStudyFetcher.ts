import {FIELD_OF_STUDY_BASE_ROUTE} from "../../../shared/consts";
import {FieldOfStudyDTOSet} from "../models/fieldOfStudyDto";
import {getDataWithParams} from "../../../shared/api";

export const fetchFieldsOfStudy = async (offset: number, count: number, universityId: number | undefined,
                                         fieldOfStudyName: string | undefined) => {
    return (await getDataWithParams<FieldOfStudyDTOSet>(FIELD_OF_STUDY_BASE_ROUTE,
        {offset: offset, count: count, university_id: universityId, field_of_study_name: fieldOfStudyName}))?.data
}