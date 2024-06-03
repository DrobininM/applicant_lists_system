import {makeAutoObservable} from "mobx";
import {getApplicationDataByIndexes} from "../utils/filter";

export default class ApplicationStore {
    constructor() {
        this._applications = null;
        this._subjectNames = []
        this._withoutEmptyOtherOp = []
        makeAutoObservable(this)
    }

    setApplications(data) {
        this._applications = data;
        this._subjectNames = data.subject_name_list;
        this._withoutEmptyOtherOp = data//this.getWithoutEmptyOtherOp()[0]
    }

    get applications() {
        return this._applications;
    }

    get withoutEmptyOtherOp() {
        return this._withoutEmptyOtherOp;
    }

    get subjectNames() {
        return this._subjectNames
    }

    getWithoutEmptyOtherOp() {
        let notEmptyIndexes = []
        let ap = this._applications;
        let count = ap.list_of_other_programs.length;
        for (let i = 0; i < count; i++) {
            if (ap.list_of_other_programs[i].length !== 0) {
                notEmptyIndexes.push(i)
            }
        }

        return getApplicationDataByIndexes(notEmptyIndexes, ap);
    }
}