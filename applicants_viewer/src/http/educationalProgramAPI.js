import {host} from './index';
import {EDUCATIONAL_PROGRAMS_ROUTE} from "../consts/urls";

export default async function getAllPrograms() {
    const {data} = await host.get(EDUCATIONAL_PROGRAMS_ROUTE)

    console.log(data)

    return data
}