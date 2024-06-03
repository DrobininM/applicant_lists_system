import {Requirement, SelectionTable, TableModel} from "../../../entities/SchemaCreation";
import {RequirementsManager} from "../../../entities/SchemaCreation";
import {FC, useState} from "react";
import {observer} from "mobx-react-lite";
import styles from './styles.module.css';
import {texts as componentTexts} from '../consts/texts';
import {RequirementModel} from "../../../entities/SchemaCreation/models/requirementModel";
import {InputRequirement} from "../../../entities/SchemaCreation/ui/InputRequirement/InputRequirement";
import {SelectableRequirement} from "../../../entities/SchemaCreation/ui/SelectableRequirement/SelectableRequirement";

interface ISchemaCreationTableProps {
    tableModel: TableModel | undefined;
    requirementsManager: RequirementsManager | undefined;
}

export const SchemaCreationTable: FC<ISchemaCreationTableProps> = observer(({tableModel, requirementsManager}) => {
    if (tableModel === undefined || requirementsManager === undefined) {
        return <></>
    }

    if (tableModel.rowCount === 0 || tableModel.columnCount === 0) {
        return <div>{componentTexts.emptyTable}</div>
    }

    const [nextSubjectId, setNextSubjectId] = useState(Math.min(...requirementsManager.requirementModels.filter(model => model.isSubject).map(model => model.id - 1), -1));

    const onAddPressed = () => {
        const subjectRequirement = new RequirementModel(nextSubjectId, "", true);

        requirementsManager.requirementModels.push(subjectRequirement);

        setNextSubjectId((prevState) => prevState - 1);
    }

    const baseRequirementModels = getBaseRequirements(requirementsManager.requirementModels);

    const onRequirementSelected = (model: RequirementModel | undefined) => {
        if (model === undefined) {
            requirementsManager.selectedSubstitutionId = undefined;
        } else {
            requirementsManager.selectedSubstitutionId = model.id;
        }
    }

    return (
        <div>
            <table className={styles.requirements_table} cellSpacing={"0"} cellPadding={"0"}>
                <tbody>
                    <tr>
                        {baseRequirementModels.filter((model, i) => i % 2 === 0)
                            .map((model, i) =>
                                <td className={styles.requirement_cell} key={i}>{getRequirementComponent(model, requirementsManager,
                                    requirementsManager?.selectedSubstitutionId, onRequirementSelected)}</td>)}
                    </tr>

                    <tr>
                        {baseRequirementModels.filter((model, i) => i % 2 !== 0)
                            .map((model, i) =>
                                <td className={styles.requirement_cell} key={i}>{getRequirementComponent(model, requirementsManager,
                                    requirementsManager?.selectedSubstitutionId, onRequirementSelected)}</td>)}
                    </tr>
                </tbody>
            </table>

            <div className={styles.subjects_section_holder}>
                <div className={styles.subjects_label_holder}>
                    <span className={styles.subjects_label}>{componentTexts.subjects}</span>

                    <div className={styles.add_btn_holder}>
                        <button className={styles.add_btn}
                                onClick={() => onAddPressed()}>+</button>
                    </div>
                </div>

                <div className={styles.subjects_holder}>
                    {requirementsManager.requirementModels.filter(model => model.isSubject).map(model =>
                        <InputRequirement key={model.id}
                                          requirementModel={model}
                                          requirementsManager={requirementsManager} />)}
                </div>
            </div>

            <div className={styles.application_table_holder}>
                <SelectionTable tableModel={tableModel} />
            </div>
        </div>
    )
})

const getBaseRequirements = (requirementModels: RequirementModel[]) => {
    const result = [];
    const modelsToExclude = new Set();

    for (let i = 0; i < requirementModels.length; i++) {
        const requirementModel = requirementModels[i];

        if (!requirementModel.isSubject && !requirementModel.relatedRequirementId) {
            result.push(requirementModel);
        } else if (requirementModel.relatedRequirementId) {
            if (!modelsToExclude.has(requirementModel.id)) {
                result.push(requirementModel);
                modelsToExclude.add(requirementModel.relatedRequirementId);
            }
        }
    }

    return result;
}

const getRequirementComponent = (requirementModel: RequirementModel, requirementsManager: RequirementsManager,
                                 selectedRequirementId: number | undefined,
                                 onRequirementSelected: (requirementModel: RequirementModel | undefined) => void) => {
    if (!requirementModel.relatedRequirementId) {
        return <Requirement requirementModel={requirementModel} requirementsManager={requirementsManager} />;
    }

    const selectableModels = [requirementModel,
        ...requirementsManager.requirementModels.filter(model => model.relatedRequirementId === requirementModel.id)]

    const selectedRequirement = requirementsManager.requirementModels.filter(model => model.id === selectedRequirementId)[0];

    return <SelectableRequirement selectableRequirements={selectableModels}
                                  requirementsManager={requirementsManager}
                                  selectedModel={selectedRequirementId ? selectedRequirement : undefined}
                                  onRequirementSelected={onRequirementSelected} />;
}