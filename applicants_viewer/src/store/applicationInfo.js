import {makeAutoObservable} from "mobx";

export default class ApplicationInfoStore {
    constructor() {
        this._info = null;
        makeAutoObservable(this)
    }

    setInfo(data) {
        this._info = data;
    }

    get info() {
        return this._info;
    }
}