import {ServiceBase} from "../../../shared/models/store";
import {SchemaCreationStore} from "./schemaCreationStore";
import {
    editApplicationSchema,
    fetchApplicationSchema,
    fetchProcessedFile,
    postNewApplicationSchema
} from "../api/schemaAPI";
import {TableCellModel} from "./tableModels/tableCellModel";
import {TableModel} from "./tableModels/tableModel";
import {RequirementModel} from "./requirementModel";
import {RequirementsManager} from "./requirementsManager";
import {TableCellDTO} from "../api/tableCellDTO";
import {RequirementDTO} from "../api/requirementDTO";
import {ApplicationFileSchemaDTO} from "../api/applicationFileSchemaDTO";
import {ApplicationSchemaDTO} from "../api/applicationSchemaDTO";
import {SelectionRangeDTO} from "../api/selectionRangeDTO";
import {SelectionRange} from "./selectionRange";
import {makeObservable, observable} from "mobx";
import {PeriodService} from "../../Period";
import {StudyModeService} from "../../StudyMode";
import {CompetitionTypeService} from "../../CompetitionType";

export class ApplicationSchemaService extends ServiceBase {
    public schemaStore: SchemaCreationStore = new SchemaCreationStore();
    public readonly periodService: PeriodService = new PeriodService();
    public readonly studyModeService: StudyModeService = new StudyModeService();
    public readonly competitionTypeService: CompetitionTypeService = new CompetitionTypeService();
    public tableModel: TableModel | undefined;
    public requirementsManager: RequirementsManager | undefined;
    public isSaving: boolean = false;

    constructor() {
        super();

        makeObservable(this, {
            isSaving: observable,
            tableModel: observable,
            requirementsManager: observable,
        })
    }

    public async loadProcessedFileToStore(excelFile: File) {
        this.setIsLoading(true);

        const json = await fetchProcessedFile(excelFile)

        this.initializeModels(json);
        this.schemaStore.chosenFile = excelFile;

        this.requirementsManager!.selectedSubstitutionId = this.requirementsManager!.requirementModels
            .filter(model => model.displayName.trim().toLowerCase().includes("приоритет"))[0]?.id

        this.setIsLoading(false);
    }

    public async loadApplicationSchemaToStore(applicationId: number) {
        this.setIsLoading(true);

        const json = await fetchApplicationSchema(applicationId);
        const applicationFileDTO = json.application_file;

        this.initializeModels(applicationFileDTO);

        this.schemaStore.cityName = json.city_name;
        this.schemaStore.universityName = json.university_name;
        this.schemaStore.fieldOfStudyName = json.field_of_study_name;
        this.schemaStore.programName = json.program_name;
        this.schemaStore.enrollmentPeriodId = json.enrollment_period_id;
        this.schemaStore.studyModeId = json.study_mode_id;
        this.schemaStore.competitionTypeId = json.competition_type_id;
        this.schemaStore.budgetSeats = json.budget_seats;
        this.schemaStore.commercialSeats = json.commercial_seats;
        this.schemaStore.targetedSeats = json.targeted_seats;
        this.schemaStore.applicationLink = json.application_link;

        this.requirementsManager!.selectedSubstitutionId = applicationFileDTO.requirements
            .filter(model => model.substitution_requirement_id && model.range)[0].requirement_id

        this.setIsLoading(false);
    }

    public async createApplicationSchema(isUpdating: boolean) {
        this.isSaving = true;

         this.requirementsManager!.requirementModels
            .filter(model => model.relatedRequirementId && model.id !== this.requirementsManager?.selectedSubstitutionId)
             .forEach(model => model.selectionRange = undefined)

        const fileSchemaDTO = this.createFileSchemaDTO();

        const applicationSchemaDTO = new ApplicationSchemaDTO(this.schemaStore.cityName!.trim(), this.schemaStore.universityName!.trim(),
            this.schemaStore.fieldOfStudyName!.trim(), this.schemaStore.programName!.trim(), this.schemaStore.enrollmentPeriodId!, this.schemaStore.studyModeId!,
            this.schemaStore.competitionTypeId!, this.schemaStore.budgetSeats!, this.schemaStore.commercialSeats!, this.schemaStore.targetedSeats!,
            fileSchemaDTO, undefined, this.schemaStore.applicationLink?.trim());

        let result: boolean;

        if (isUpdating) {
            applicationSchemaDTO.application_id = this.schemaStore.applicationId;
            result = await editApplicationSchema(applicationSchemaDTO);
        } else {
            result = await postNewApplicationSchema(applicationSchemaDTO);
        }

        this.isSaving = false;

        return result;
    }

    public reload() {
        this.tableModel = undefined;
        this.requirementsManager = undefined;

        this.periodService.store.clear();
        this.periodService.load();

        this.studyModeService.store.clear();
        this.studyModeService.load();

        this.competitionTypeService.store.clear();
        this.competitionTypeService.load();

        this.schemaStore = new SchemaCreationStore();
    }

    private initializeModels(fileSchemaDTO: ApplicationFileSchemaDTO) {
        const cellDtoList = fileSchemaDTO.selection_cells;
        this.initializeTableModel(cellDtoList, fileSchemaDTO.row_count, fileSchemaDTO.column_count);

        const requirementsDtoList = fileSchemaDTO.requirements;
        this.initializeRequirementsManager(requirementsDtoList, this.tableModel!);
    }

    private initializeTableModel(cellDtoList: TableCellDTO[], rowCount: number, columnCount: number) {
        const cellModels = cellDtoList.map((dto: any) => {
            const model = new TableCellModel();
            model.displayContent = dto.cell_content;
            model.requirementId = dto.requirement_id;
            model.isSelected = !!dto.requirement_id

            return model;
        })

        this.tableModel = new TableModel();
        this.tableModel.initializeCells(cellModels, rowCount, columnCount);
    }

    private initializeRequirementsManager(requirementsDtoList: RequirementDTO[], tableModel: TableModel) {
        const requirementModels = requirementsDtoList.map(dto =>
            new RequirementModel(dto.requirement_id, dto.requirement_name, dto.is_subject,
                dto.substitution_requirement_id, dto.is_classification_required, dto.classification, tableModel.getRange(dto.requirement_id)));

        this.requirementsManager = new RequirementsManager(requirementModels, tableModel);
    }

    private createFileSchemaDTO() {
        const requirementsDTO = this.requirementsManager!.requirementModels.map(createRequirementDTO)

        const cellsDTO = Array.from(this.tableModel!.cellModels).map(createCellDTO)

        return new ApplicationFileSchemaDTO(requirementsDTO, cellsDTO, this.tableModel!.rowCount!, this.tableModel!.columnCount!)
    }
}

const createRequirementDTO = (requirementModel: RequirementModel) => {
    console.log("name")
    console.log(requirementModel)
    return new RequirementDTO(requirementModel.id, requirementModel.displayName,
        requirementModel.selectionRange ? createRangeDTO(requirementModel.selectionRange) : undefined, requirementModel.isSubject,
        requirementModel.relatedRequirementId, requirementModel.isClassificationRequired,
        requirementModel.classification);
}

const createRangeDTO = (rangeModel: SelectionRange) => {
    return new SelectionRangeDTO(rangeModel.rowStartIndex!, rangeModel.columnStartIndex!, rangeModel.rowEndIndex,
        rangeModel.columnEndIndex, rangeModel.pivotContent!);
}

const createCellDTO = (cellModel: TableCellModel) => {
    return new TableCellDTO(cellModel.displayContent, cellModel.requirementId);
}