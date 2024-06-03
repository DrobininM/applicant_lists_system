import {ApplicationFileSchemaDTO} from "./applicationFileSchemaDTO";

export class ApplicationSchemaDTO {
    city_name: string;
    university_name: string;
    field_of_study_name: string;
    program_name: string;
    enrollment_period_id: number;
    study_mode_id: number;
    competition_type_id: number;
    budget_seats: number;
    commercial_seats: number;
    targeted_seats: number;
    application_file: ApplicationFileSchemaDTO;
    application_id: number | undefined;
    application_link: string | undefined;

    constructor(cityName: string, universityName: string, fieldOfStudyName: string, programName: string,
                periodId: number, studyModeId: number, competitionTypeId: number, budgetSeats: number,
                commercialSeats: number, targetedSeats: number, applicationFile: ApplicationFileSchemaDTO,
                applicationId: number | undefined = undefined, applicationLink: string | undefined = undefined) {
        this.city_name = cityName;
        this.university_name = universityName;
        this.field_of_study_name = fieldOfStudyName;
        this.program_name = programName;
        this.enrollment_period_id = periodId;
        this.study_mode_id = studyModeId;
        this.competition_type_id = competitionTypeId;
        this.budget_seats = budgetSeats;
        this.commercial_seats = commercialSeats;
        this.targeted_seats = targetedSeats;
        this.application_file = applicationFile;
        this.application_id = applicationId;
        this.application_link = applicationLink;
    }
}