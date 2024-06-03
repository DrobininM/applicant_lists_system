import {PartialService} from "../../../shared/models/store";
import {FieldOfStudyModel} from "./fieldOfStudyModel";
import {fetchFieldsOfStudy} from "../api/fieldOfStudyFetcher";

export class FieldOfStudyService extends PartialService<FieldOfStudyModel> {
    protected async doLoadToStore(offset: number, count: number, filterObject: any): Promise<void> {
        const universityId = filterObject?.universityId;
        const fieldOfStudyName = filterObject?.fieldOfStudyName;
        const dto = await fetchFieldsOfStudy(offset, count, universityId, fieldOfStudyName);

        this.store.addItems(dto.fields_of_study.map(dtoField =>
            new FieldOfStudyModel(dtoField.field_of_study_id, dtoField.field_of_study_name)))

        this.store.setTotalCount(this.store.items.length + dto.total_count);
    }
}