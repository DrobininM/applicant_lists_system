import {NamedEntity} from "../../../shared/models/entity";

export class FieldOfStudyModel extends NamedEntity {
    constructor(id: number, name: string) {
        super(id, name, name);
    }
}