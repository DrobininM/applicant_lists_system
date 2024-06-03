import {OrdinaryService} from "../../../shared/models/store";
import {UniversityModel} from "./universityModel";
import {fetchAllUniversities} from "../api/universityFetcher";

export class UniversityService extends OrdinaryService<UniversityModel> {
    protected async doLoadToStore(filterObject: any): Promise<void> {
        const dtoList = await fetchAllUniversities();

        const modelList = dtoList.map(dto => new UniversityModel(dto.university_id, dto.university_name,
            dto.city_id, dto.city_name));

        const universityNames = modelList.map(model => model.name);
        const notUniqueNames = new Set(universityNames
            .filter(name => universityNames.filter(universityName => universityName === name).length > 1))

        modelList.forEach(model => {
            if (notUniqueNames.has(model.name)) {
                model.displayName = model.name + " (" + model.cityName + ")";
            }
        })

        this.store.addItems(modelList);
    }
}