import {Entity} from "../../../shared/models/entity";

export class ApplicantListPreviewModel extends Entity {
    public readonly universityName: string;
    public readonly cityName: string;
    public readonly fieldOfStudyName: string;
    public readonly programName: string;
    public readonly competitionType: string;
    public readonly studyMode: string;
    public readonly periodStart: Date;
    public readonly periodEnd: Date | undefined;
    public readonly link: string | undefined;

    constructor(id: number, universityName: string, cityName: string, fieldOfStudyName: string, programName: string,
                competitionType: string, studyMode: string, periodStart: Date, periodEnd: Date | undefined = undefined,
                link: string | undefined = undefined) {
        super(id);

        this.universityName = universityName;
        this.cityName = cityName;
        this.fieldOfStudyName = fieldOfStudyName;
        this.programName = programName;
        this.competitionType = competitionType;
        this.studyMode = studyMode;
        this.periodStart = periodStart;
        this.periodEnd = periodEnd;
        this.link = link;
    }
}