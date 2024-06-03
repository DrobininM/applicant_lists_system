import {NamedEntity} from "../../../shared/models/entity";

export class UniversityModel extends NamedEntity {
    public readonly cityId: number;
    public readonly cityName: string;

    constructor(id: number, name: string, cityId: number, cityName: string) {
        super(id, name, name);

        this.cityId = cityId;
        this.cityName = cityName;
    }
}