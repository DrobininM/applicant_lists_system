import {Entity} from "./entity";

export class NamedEntity extends Entity {
    public readonly name: string;
    public displayName: string;

    constructor(id: number, name: string, displayName: string) {
        super(id);

        this.name = name;
        this.displayName = displayName;
    }
}