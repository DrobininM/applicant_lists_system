import axios from "axios";

const host = axios.create({
    baseURL: process.env.REACT_APP_APPLICATIONS_API_URL
})

export async function getData<T>(url: string) {
    return await host.get<T>(url);
}

export async function getDataWithParams<T>(url: string, queryParams: object) {
    return await host.get<T>(url, {params: queryParams});
}

export async function postData<T>(url: string, data: object) {
    return await host.post<T>(url, data);
}

export async function deleteData(url: string, queryParams: object) {
    return await host.delete(url, {params: queryParams});
}