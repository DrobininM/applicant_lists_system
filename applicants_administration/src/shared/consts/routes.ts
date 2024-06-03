export const UNIVERSITY_BASE_ROUTE = "universities"
export const FIELD_OF_STUDY_BASE_ROUTE = "fields_of_study"
export const PERIOD_BASE_ROUTE = "enrollment_periods"
export const ADD_PERIOD_ROUTE = PERIOD_BASE_ROUTE + "/create_period"
export const EDIT_PERIOD_ROUTE = PERIOD_BASE_ROUTE+ "/edit_period"
export const REMOVE_PERIOD_ROUTE = PERIOD_BASE_ROUTE + "/delete_period"
export const STUDY_MODE_BASE_ROUTE = "study_modes"
export const COMPETITION_TYPE_BASE_ROUTE = "competition_types"

const APPLICATION_BASE_ROUTE = "applications";
export const GET_APPLICATIONS_BY_FILTER = APPLICATION_BASE_ROUTE + "/get_applications_by_filter"

const APPLICANT_FILES_BASE_ROUTE = "applicant_files"
export const GET_PROCESSED_FILE_ROUTE = APPLICANT_FILES_BASE_ROUTE + "/get_processed_file"
export const GET_APPLICATION_SCHEMA_ROUTE = APPLICANT_FILES_BASE_ROUTE + "/get_applicant_list_info"
export const CREATE_APPLICATION_SCHEMA_ROUTE = APPLICANT_FILES_BASE_ROUTE + "/add_applicant_list_info"
export const EDIT_APPLICATION_SCHEMA_ROUTE = APPLICANT_FILES_BASE_ROUTE + "/edit_applicant_list_info"
export const CHECK_CAN_PROCESS_FILE_ROUTE = APPLICANT_FILES_BASE_ROUTE + "/check_can_process_file"
export const REMOVE_APPLICATION_ROUTE = APPLICANT_FILES_BASE_ROUTE + "/remove_applicant_list"