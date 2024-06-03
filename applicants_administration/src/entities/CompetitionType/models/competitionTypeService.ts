import {OrdinaryService} from "../../../shared/models/store";
import {CompetitionTypeModel} from "./competitionTypeModel";
import { fetchAllCompetitionTypes } from "../api/competitionTypeFetcher";

export class CompetitionTypeService extends OrdinaryService<CompetitionTypeModel> {
    protected async doLoadToStore(filterObject: any): Promise<void> {
        const dtoList = await fetchAllCompetitionTypes();

        const modelList = dtoList.map(dto => new CompetitionTypeModel(dto.competition_type_id, dto.competition_type_name));

        this.store.addItems(modelList);
    }
}