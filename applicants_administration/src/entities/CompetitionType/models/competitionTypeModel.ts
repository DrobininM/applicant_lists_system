import {NamedEntity} from "../../../shared/models/entity";

export class CompetitionTypeModel extends NamedEntity {
    constructor(id: number, name: string) {
        super(id, name, name);
    }
}