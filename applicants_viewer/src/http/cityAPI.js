import {host} from './index';
import {CITIES_ROUTE} from "../consts/urls";

export default async function getAllCities() {
    const {data} = await host.get(CITIES_ROUTE)

    console.log(data)

    return data
}