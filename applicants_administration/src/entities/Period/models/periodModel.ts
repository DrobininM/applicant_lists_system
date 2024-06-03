import {NamedEntity} from "../../../shared/models/entity";
import {convertTwoDatesToRange} from "../../../shared/lib";

export class PeriodModel extends NamedEntity {
    public readonly startDate: Date;
    public readonly endDate: Date | undefined;

    constructor(id: number, startDate: Date, endDate: Date | undefined) {
        const dateRange = convertTwoDatesToRange(startDate, endDate)

        super(id, dateRange, dateRange);

        this.startDate = startDate;
        this.endDate = endDate;
    }
}