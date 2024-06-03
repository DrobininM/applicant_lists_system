import {OrdinaryService} from "../../../shared/models/store";
import {PeriodModel} from "./periodModel";
import {deletePeriod, editPeriod, fetchAllPeriods, postNewPeriod} from "../api/periodFetcher";
import {makeObservable, observable} from "mobx";
import {PeriodDTO} from "./periodDTO";

export class PeriodService extends OrdinaryService<PeriodModel> {
    public isSaving: boolean = false;

    constructor() {
        super();

        makeObservable(this, {
            isSaving: observable,
        })
    }

    public async addNewPeriod(startDate: Date, endDate: Date | undefined, periodId: number | undefined) {
        this.isSaving = true;

        if (periodId) {
            await editPeriod(new PeriodDTO(periodId, startDate.toISOString(), endDate?.toISOString()));
        } else {
            await postNewPeriod(startDate, endDate);
        }

        this.store.clear();
        await this.load();

        this.isSaving = false;
    }

    public async removePeriod(periodId: number) {
        this.isSaving = true;

        await deletePeriod(periodId)

        this.store.clear();
        await this.load();

        this.isSaving = false;
    }

    protected async doLoadToStore(filterObject: any): Promise<void> {
        const dtoList = await fetchAllPeriods();

        const modelList = dtoList.map(dto =>
            new PeriodModel(dto.period_id, new Date(dto.period_start_date), dto.period_end_date ? new Date(dto.period_end_date) : undefined));

        const result = modelList.sort((period1, period2) => {
            if (period1.startDate < period2.startDate) {
                return 1;
            }

            if (period1.startDate === period2.startDate) {
                return 0;
            }

            return -1;
        })

        this.store.addItems(result);
    }
}