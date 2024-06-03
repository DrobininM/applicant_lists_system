import { CompetitionTypeDTO } from "../../CompetitionType"
import { StudyModeDTO } from "../../StudyMode"
import {SubjectDTO} from "../../Subject";
import {CityDTO} from "../../City";
import {ProgramDTO} from "../../Program";
import {UniversityDTO} from "../../University";
import {FieldOfStudyDTO} from "../../FieldOfStudy";
import {PeriodDTO} from "../../Period";

export class ApplicationDTO {
    application_id: number;
    city: CityDTO;
    university: UniversityDTO;
    field_of_study: FieldOfStudyDTO;
    program: ProgramDTO;
    study_mode: StudyModeDTO;
    competition_type: CompetitionTypeDTO;
    enrollment_period: PeriodDTO;
    budget_seats: number;
    commercial_seats: number;
    targeted_seats: number;
    subject_list: SubjectDTO[];
    application_link: string | undefined
    last_check_date: Date | undefined

    constructor(id: number, city: CityDTO, university: UniversityDTO, fieldOfStudy: FieldOfStudyDTO, program: ProgramDTO, studyMode: StudyModeDTO,
                competitionType: CompetitionTypeDTO, enrollmentPeriod: PeriodDTO, budgetSeats: number,
                commercialSeats: number, targetedSeats: number, subjectList: SubjectDTO[],
                applicationList: string | undefined, lastCheckDate: Date | undefined) {
        this.application_id = id;
        this.city = city;
        this.university = university;
        this.field_of_study = fieldOfStudy;
        this.program = program;
        this.study_mode = studyMode;
        this.competition_type = competitionType;
        this.enrollment_period = enrollmentPeriod;
        this.budget_seats = budgetSeats;
        this.commercial_seats = commercialSeats;
        this.targeted_seats = targetedSeats;
        this.subject_list = subjectList;
        this.application_link = applicationList;
        this.last_check_date = lastCheckDate;
    }
}

export class ApplicationDTOSet {
    applications: ApplicationDTO[];
    total_count: number;

    constructor(applications: ApplicationDTO[], totalCount: number) {
        this.applications = applications;
        this.total_count = totalCount;
    }
}