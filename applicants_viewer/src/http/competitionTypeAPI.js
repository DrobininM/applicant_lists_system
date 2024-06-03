import {host} from './index';
import {COMPETITION_TYPES_ROUTE} from "../consts/urls";

export default async function getAllCompetitions() {
    const {data} = await host.get(COMPETITION_TYPES_ROUTE)

    console.log(data)

    return data
}