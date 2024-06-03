import {StoreService} from "./storeService";
import {Entity} from "../entity";

export abstract class OrdinaryService<TItem extends Entity> extends StoreService<TItem> {
    public async load(filterObject: any = undefined) {
        this.setIsLoading(true);

        try {
            await this.doLoadToStore(filterObject);
        }
        catch (error) {
            console.log(error)
        }

        this.setIsLoading(false);
    }

    protected abstract doLoadToStore(filterObject: any): Promise<void>;
}