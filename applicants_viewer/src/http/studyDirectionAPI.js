import {host} from './index';
import {STUDY_DIRECTIONS_ROUTE} from "../consts/urls";

export default async function getAllStudyDirections() {
    const {data} = await host.get(STUDY_DIRECTIONS_ROUTE)

    console.log(data)

    return data
}