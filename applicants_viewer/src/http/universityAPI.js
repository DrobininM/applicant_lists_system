import {host} from './index';
import {UNIVERSITIES_ROUTE} from "../consts/urls";

export default async function getAllUniversities() {
    const {data} = await host.get(UNIVERSITIES_ROUTE)

    console.log(data)

    return data
}