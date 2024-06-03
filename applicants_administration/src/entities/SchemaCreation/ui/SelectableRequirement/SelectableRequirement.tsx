import {FC, useState} from "react";
import {RequirementModel} from "../../models/requirementModel";
import {ComboBox} from "../../../../shared/ui/ComboBox";
import {convertEntityToOption} from "../../../../shared/lib";
import requirementStyles from "../Requirement/styles.module.css";
import styles from './styles.module.css'
import {texts as componentTexts} from "../../consts/texts";
import {texts as sharedTexts} from "../../../../shared/consts";
import {rangeToString} from "../../lib/helpers";
import {RequirementsManager} from "../../models/requirementsManager";
import {observer} from "mobx-react-lite";

interface ISelectableRequirementProps {
    selectableRequirements: RequirementModel[],
    selectedModel: RequirementModel | undefined,
    requirementsManager: RequirementsManager,
    onRequirementSelected: (requirement: RequirementModel | undefined) => void;
}

export const SelectableRequirement: FC<ISelectableRequirementProps> = observer(({selectableRequirements,
                                                                           selectedModel, requirementsManager, onRequirementSelected}) => {
    const [selectedRequirement, setSelectedRequirement] = useState<RequirementModel | undefined>(selectedModel);

    const onSelectionChanged = (newOption: {label: string, value: any} | null) => {
        const requirementModel = newOption ? selectableRequirements.filter(model => model.id === newOption.value)[0] : undefined;

        setSelectedRequirement(requirementModel);
        onRequirementSelected(requirementModel);
    }

    return (
        <div>
            <div className={styles.label_holder}>
                <div className={requirementStyles.check_holder}>
                    {selectedRequirement?.selectionRange ? "+" : ""}
                </div>

                <div className={styles.combobox_holder}>
                    <ComboBox options={selectableRequirements.map(convertEntityToOption)}
                              selectedValue={selectedRequirement ? convertEntityToOption(selectedRequirement) : undefined}
                              placeholder={"Да"}
                              isClearable={false}
                              onChange={(newOption) => onSelectionChanged(newOption)} />
                </div>
            </div>

            <div className={selectedRequirement?.isAvailable ? `${requirementStyles.choose_btn_holder}`
                : `${requirementStyles.choose_btn_holder_hidden} ${requirementStyles.choose_btn_holder}`}>
                <button onClick={() => requirementsManager.onRangeChoosingPressed(selectedRequirement!)}
                        className={requirementStyles.choose_btn}>
                    {selectedRequirement!.selectionRange ? rangeToString(selectedRequirement!.selectionRange, requirementsManager.columnNames)
                        : selectedRequirement!.isPending ? sharedTexts.done : sharedTexts.select}
                </button>
            </div>

            {selectedRequirement?.isClassificationRequired ?
                <div className={requirementStyles.second_row}>
                    <span className={requirementStyles.positive_value}>{componentTexts.positiveValue}</span>
                    <input className={requirementStyles.classification}
                           placeholder={sharedTexts.input}
                           value={selectedRequirement.classification}
                           onChange={(e) => selectedRequirement.classification = e.target.value} />
                </div> : <></>}
        </div>
    )
})