export class ProgramDTO {
    program_id: number;
    program_name: string;

    constructor(id: number, name: string) {
        this.program_id = id;
        this.program_name = name;
    }
}