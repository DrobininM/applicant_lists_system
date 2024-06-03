export class PeriodDTO {
    period_id: number;
    period_start_date: string;
    period_end_date: string | undefined;

    constructor(id: number, startDate: string, endDate: string | undefined) {
        this.period_id = id;
        this.period_start_date = startDate;
        this.period_end_date = endDate;
    }
}