export class FieldOfStudyDTO {
    field_of_study_id: number;
    field_of_study_name: string;

    constructor(id: number, name: string) {
        this.field_of_study_id = id;
        this.field_of_study_name = name;
    }
}

export class FieldOfStudyDTOSet {
    fields_of_study: FieldOfStudyDTO[];
    total_count: number;

    constructor(fields_of_study: FieldOfStudyDTO[], total_count: number) {
        this.fields_of_study = fields_of_study;
        this.total_count = total_count;
    }
}