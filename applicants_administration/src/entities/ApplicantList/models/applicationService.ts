import {PartialService} from "../../../shared/models/store";
import {ApplicantListPreviewModel} from "./applicantListPreviewModel";
import {fetchApplicantLists} from "../api/applicantListFetcher";
import {deleteApplication} from "../../SchemaCreation/api/schemaAPI";

export class ApplicationService extends PartialService<ApplicantListPreviewModel> {
    public deleteApplication(applicationId: number) {
        const itemToRemove = this.store.findItemById(applicationId);

        if (!itemToRemove) {
            return;
        }

        deleteApplication(applicationId)

        const itemIndex = this.store.items.indexOf(itemToRemove);
        this.store.items = [...this.store.items.slice(0, itemIndex), ...this.store.items.slice(itemIndex + 1)]
    }

    protected async doLoadToStore(offset: number, count: number, filterObject: any | undefined): Promise<void> {
        this.setIsLoading(true);

        this.store.clear();

        const universityId = filterObject?.universityId;
        const fieldOfStudyId = filterObject?.fieldOfStudyId;
        const periodId = filterObject?.enrollmentPeriodId;
        const programName = filterObject?.programName;

        const dto = await fetchApplicantLists(universityId, fieldOfStudyId, periodId, programName, offset, count);
        console.log(dto)
        this.store.setTotalCount(dto.total_count);

        this.store.addItems(dto.applications.map(application => {
            const period = application.enrollment_period;

            return new ApplicantListPreviewModel(application.application_id, application.university.university_name, application.university.city_name,
                application.field_of_study.field_of_study_name, application.program.program_name,
                application.competition_type.competition_type_name, application.study_mode.study_mode_name,
                new Date(period.period_start_date), period.period_end_date ? new Date(period.period_end_date) : undefined,
                application.application_link)
        }))

        this.setIsLoading(false)
    }
}