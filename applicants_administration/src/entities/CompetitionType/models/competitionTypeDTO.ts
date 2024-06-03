export class CompetitionTypeDTO {
    competition_type_id: number;
    competition_type_name: string;

    constructor(id: number, name: string) {
        this.competition_type_id = id;
        this.competition_type_name = name;
    }
}