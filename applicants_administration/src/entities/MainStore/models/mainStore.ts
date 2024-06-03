import {UniversityService} from "../../University";
import {FieldOfStudyService} from "../../FieldOfStudy";
import {PeriodService} from "../../Period";

export class MainStore {
    public readonly universityService: UniversityService;
    public readonly fieldOfStudyService: FieldOfStudyService;
    public readonly periodService: PeriodService;

    constructor() {
        this.universityService = new UniversityService();
        this.fieldOfStudyService = new FieldOfStudyService();
        this.periodService = new PeriodService();
    }

    loadAll() {
        this.universityService.load();
        this.fieldOfStudyService.load(0, 30);
        this.periodService.load();
    }
}