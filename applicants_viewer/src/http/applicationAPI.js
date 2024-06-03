import {host} from './index';
import {
    LAST_APPLICATION_ROUTE
} from "../consts/urls";

// export async function getAllApplications(universityId, directionId, programId, competitionId, studyModeId) {
//     const {data} = await host.get(APPLICATION_ENTRIES_ROUTE + "?university_id=" + universityId + "&direction_id=" + directionId + "&program_id=" + programId + "&competition_id=" + competitionId + "&study_mode_id=" + studyModeId)
//
//     console.log("api appl", data)
//
//     return data
// }
//
// export async function getApplicationInfo(universityId, directionId, programId, competitionId, studyModeId) {
//     const {data} = await host.get(APPLICATION_INFO_ROUTE + "?university_id=" + universityId + "&direction_id=" + directionId + "&program_id=" + programId + "&competition_id=" + competitionId + "&study_mode_id=" + studyModeId)
//     const programInfo = await getProgramInfo(universityId, directionId, programId);
//
//     let merged = {
//         ...data,
//         ...programInfo
//     }
//
//     return merged
// }
//
// async function getProgramInfo(universityId, directionId, programId) {
//     const {data} = await host.get(APPLICATION_PROGRAM_INFO_ROUTE + "?university_id=" + universityId + "&direction_id=" + directionId + "&program_id=" + programId);
//
//     return data;
// }

export async function getLastApplication(universityId, directionId, programId, competitionId, studyModeId) {
    const {data} = await host.get(LAST_APPLICATION_ROUTE +
        "?university_id=" + universityId +
        "&field_of_study_id=" + directionId +
        "&program_id=" + programId + "&competition_type_id=" + competitionId + "&study_mode_id=" + studyModeId);

    return data;
}