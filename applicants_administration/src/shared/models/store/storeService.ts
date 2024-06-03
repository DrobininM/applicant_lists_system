import {Entity} from "../entity";
import {Store} from "./store";
import {ServiceBase} from "./serviceBase";

export abstract class StoreService<TItem extends Entity> extends ServiceBase {
    public readonly store: Store<TItem> = new Store<TItem>();
}