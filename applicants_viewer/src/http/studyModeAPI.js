import {host} from './index';
import {STUDY_MODES_ROUTE} from "../consts/urls";

export default async function getAllStudyModes() {
    const {data} = await host.get(STUDY_MODES_ROUTE)

    console.log(data)

    return data
}