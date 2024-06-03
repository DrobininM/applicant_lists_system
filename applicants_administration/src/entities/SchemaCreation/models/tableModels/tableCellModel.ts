import {action, makeObservable, observable} from "mobx";

export class TableCellModel {
    public isSelected: boolean = false;
    public isStart: boolean | undefined;
    public requirementId: number | undefined;
    public rowIndex: number = 0;
    public columnIndex: number = 0;
    public displayContent: string = "";
    public isInRange: boolean = false;

    constructor() {
        makeObservable(this, {
            isSelected: observable,
            isStart: observable,
            isInRange: observable,
            setIsInRange: action,
        })
    }

    public setIsInRange(value: boolean) {
        this.isInRange = value;
    }
}