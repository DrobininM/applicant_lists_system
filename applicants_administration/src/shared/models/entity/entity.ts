export abstract class Entity {
    public readonly id: number;

    protected constructor(id: number) {
        this.id = id;
    }
}