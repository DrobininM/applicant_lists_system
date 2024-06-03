import {RequirementModel} from "./requirementModel";
import {TableModel} from "./tableModels/tableModel";
import {makeObservable, observable} from "mobx";

export class RequirementsManager {
    public readonly requirementModels: RequirementModel[];
    private readonly tableModel: TableModel;
    public readonly columnNames: string[] | undefined;
    public selectedSubstitutionId: number | undefined;

    constructor(requirementModels: RequirementModel[], tableModel: TableModel) {
        this.requirementModels = requirementModels;
        this.tableModel = tableModel;
        this.columnNames = tableModel.columnNames;

        makeObservable(this, {
            requirementModels: observable,
            selectedSubstitutionId: observable,
        })
    }

    public onRangeChoosingPressed(requirementModel: RequirementModel) {
        const selectionRange = this.tableModel.getRange(requirementModel.id);
        if (!selectionRange) {
            if (!requirementModel.isPending) {
                this.startRangeSelection(requirementModel);
            } else {
                requirementModel.isPending = false;
                requirementModel.selectionRange = undefined;

                this.requirementModels.forEach(model => model.setIsAvailable(true));

                this.tableModel.cancelSelection();
            }
        } else {
            if (!requirementModel.isPending) {
                this.startRangeSelection(requirementModel);

                return;
            }

            this.tableModel.finishSelection();

            requirementModel.selectionRange = selectionRange;
            requirementModel.isPending = false;

            this.requirementModels.forEach(model => model.setIsAvailable(true));
        }
    }

    private startRangeSelection(requirementModel: RequirementModel) {
        requirementModel.isPending = true;

        this.requirementModels.forEach(model => model.setIsAvailable(false));
        requirementModel.setIsAvailable(true);
        requirementModel.selectionRange = undefined;

        this.tableModel.startSelection(requirementModel.id);
    }
}