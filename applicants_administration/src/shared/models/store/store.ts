import {Entity} from "../entity";
import {action, makeObservable, observable} from "mobx";

export class Store<TItem extends Entity> {
    public items: TItem[] = [];
    public totalCount: number = 0;

    constructor() {
        makeObservable(this, {
            items: observable,
            totalCount: observable,
            setTotalCount: action,
            addItems: action,
            clear: action,
        })
    }

    public setTotalCount(count: number) {
        this.totalCount = count;
    }

    public addItems(newItems: TItem[]) {
        this.items = [...this.items, ...newItems];
    }

    public clear() {
        this.items = [];
    }

    public findItemById(id: number) {
        return this.items.find(item => item.id === id);
    }
}