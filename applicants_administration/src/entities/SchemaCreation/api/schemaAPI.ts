import {getDataWithParams} from "../../../shared/api";
import {
    GET_PROCESSED_FILE_ROUTE,
    GET_APPLICATION_SCHEMA_ROUTE,
    CREATE_APPLICATION_SCHEMA_ROUTE,
    CHECK_CAN_PROCESS_FILE_ROUTE, REMOVE_APPLICATION_ROUTE,
    EDIT_APPLICATION_SCHEMA_ROUTE
} from "../../../shared/consts";
import {ApplicationFileSchemaDTO} from "./applicationFileSchemaDTO";
import {deleteData, postData} from "../../../shared/api/fetcher";
import {ApplicationSchemaDTO} from "./applicationSchemaDTO";

export const fetchProcessedFile = async (file: File) => {
    const form = new FormData();
    form.append('file', file);

    return (await postData<ApplicationFileSchemaDTO>(GET_PROCESSED_FILE_ROUTE, form))?.data
}

export const fetchApplicationSchema = async (applicationId: number) => {
    return (await getDataWithParams<ApplicationSchemaDTO>(GET_APPLICATION_SCHEMA_ROUTE,
        {application_id: applicationId}))?.data
}

export const postNewApplicationSchema = async (applicationSchemaDTO: ApplicationSchemaDTO) => {
    return (await postData<boolean>(CREATE_APPLICATION_SCHEMA_ROUTE, {application_schema: applicationSchemaDTO})).data
}

export const editApplicationSchema = async (applicationSchemaDTO: ApplicationSchemaDTO) => {
    return (await postData<boolean>(EDIT_APPLICATION_SCHEMA_ROUTE, {application_schema: applicationSchemaDTO})).data
}

export const getCanProcessFile = async (url: string) => {
    return (await getDataWithParams<boolean>(CHECK_CAN_PROCESS_FILE_ROUTE, {url: url})).data;
}

export const deleteApplication = async (applicationId: number) => {
    await deleteData(REMOVE_APPLICATION_ROUTE, {application_id: applicationId});
}