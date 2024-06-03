import {StoreService} from "./storeService";
import {Entity} from "../entity";

export abstract class PartialService<TItem extends Entity> extends StoreService<TItem> {
    public async load(offset: number, count: number, filterObject: any = undefined) {
        this.setIsLoading(true);

        await this.doLoadToStore(offset, count, filterObject);

        this.setIsLoading(false);
    }

    protected abstract doLoadToStore(offset: number, count: number, filterObject: any): Promise<void>;
}