import {OrdinaryService} from "../../../shared/models/store";
import {StudyModeModel} from "./studyModeModel";
import {fetchAllStudyModes} from "../api/studyModeFetcher";

export class StudyModeService extends OrdinaryService<StudyModeModel> {
    protected async doLoadToStore(filterObject: any): Promise<void> {
        const dtoList = await fetchAllStudyModes();

        const modelList = dtoList.map(dto => new StudyModeModel(dto.study_mode_id, dto.study_mode_name));

        this.store.addItems(modelList);
    }
}