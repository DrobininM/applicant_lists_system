import {action, makeObservable, observable} from "mobx";

export class ServiceBase {
    public isLoading: boolean = false;

    constructor() {
        makeObservable(this, {
            isLoading: observable,
            setIsLoading: action,
        })
    }

    public setIsLoading(value: boolean) {
        this.isLoading = value;
    }
}