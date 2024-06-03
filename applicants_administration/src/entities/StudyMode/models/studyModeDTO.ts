export class StudyModeDTO {
    study_mode_id: number;
    study_mode_name: string;
    
    constructor(id: number, name: string) {
        this.study_mode_id = id;
        this.study_mode_name = name;
    }
}