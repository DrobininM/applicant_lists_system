import {getData} from "../../../shared/api";
import {ADD_PERIOD_ROUTE, EDIT_PERIOD_ROUTE, PERIOD_BASE_ROUTE, REMOVE_PERIOD_ROUTE} from "../../../shared/consts";
import {PeriodDTO} from "../models/periodDTO";
import {deleteData, postData} from "../../../shared/api/fetcher";

export const fetchAllPeriods = async () => {
    return (await getData<PeriodDTO[]>(PERIOD_BASE_ROUTE))?.data
}

export const postNewPeriod = async (startDate: Date, endDate: Date | undefined) => {
    return (await postData<boolean>(ADD_PERIOD_ROUTE, {
        period_dto: {period_start_date: startDate, period_end_date: endDate}
    }))
}

export const editPeriod = async (periodDTO: PeriodDTO) => {
    return (await postData<boolean>(EDIT_PERIOD_ROUTE, {
        period_dto: periodDTO
    }))
}

export const deletePeriod = async (periodId: number) => {
    return (await deleteData(REMOVE_PERIOD_ROUTE, {
        period_id: periodId
    }))
}