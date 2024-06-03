import {getDataWithParams} from "../../../shared/api";
import {GET_APPLICATIONS_BY_FILTER} from "../../../shared/consts";
import {ApplicationDTOSet} from "./applicationDTO";

export const fetchApplicantLists = async (universityId: number | undefined, fieldOfStudyId: number | undefined,
                                          enrollmentPeriodId: number | undefined, programName: string | undefined,
                                          offset: number | undefined = 0, count: number | undefined = 20) => {
    return (await getDataWithParams<ApplicationDTOSet>(GET_APPLICATIONS_BY_FILTER,
        {university_id: universityId, field_of_study_id: fieldOfStudyId, enrollment_period_id: enrollmentPeriodId,
            program_name: programName, offset: offset, count: count}
    ))?.data
}