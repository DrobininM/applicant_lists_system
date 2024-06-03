import {NamedEntity} from "../../../shared/models/entity";

export class StudyModeModel extends NamedEntity {
    constructor(id: number, name: string) {
        super(id, name, name);
    }
}