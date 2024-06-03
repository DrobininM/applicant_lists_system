import {makeObservable, observable} from "mobx";

export class SchemaCreationStore {
    public applicationId: number | undefined;
    public cityName: string | undefined;
    public universityName: string | undefined;
    public fieldOfStudyName: string | undefined;
    public programName: string | undefined;
    public enrollmentPeriodId: number | undefined;
    public studyModeId: number | undefined;
    public competitionTypeId: number | undefined;
    public budgetSeats: number = 0;
    public commercialSeats: number = 0;
    public targetedSeats: number = 0;
    public applicationLink: string | undefined;
    public chosenFile: File | undefined;

    constructor() {
        makeObservable(this, {
            cityName: observable,
            universityName: observable,
            fieldOfStudyName: observable,
            programName: observable,
            enrollmentPeriodId: observable,
            studyModeId: observable,
            competitionTypeId: observable,
            budgetSeats: observable,
            commercialSeats: observable,
            targetedSeats: observable,
            applicationLink: observable,
            chosenFile: observable,
        })
    }
}