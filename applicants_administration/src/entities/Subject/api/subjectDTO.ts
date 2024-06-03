export class SubjectDTO {
    subject_id: number;
    subject_name: string;

    constructor(id: number, subjectName: string) {
        this.subject_id = id;
        this.subject_name = subjectName;
    }
}