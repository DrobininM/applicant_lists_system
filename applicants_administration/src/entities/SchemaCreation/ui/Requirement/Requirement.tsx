import {RequirementModel} from "../../models/requirementModel";
import {FC} from "react";
import styles from './styles.module.css'
import {RequirementsManager} from "../../models/requirementsManager";
import {observer} from "mobx-react-lite";
import {texts as sharedTexts} from '../../../../shared/consts/texts';
import {texts as componentTexts} from '../../consts/texts';
import {rangeToString} from "../../lib/helpers";

export interface IRequirementProps {
    requirementModel: RequirementModel;
    requirementsManager: RequirementsManager;
}

export const Requirement: FC<IRequirementProps> = observer(({requirementModel, requirementsManager}) => {
    return (
        <div className={styles.content_holder}>
            <div className={styles.first_row}>
                <div className={styles.name_with_check_holder}>
                    <div className={styles.check_holder}>
                        {requirementModel.selectionRange ? "+" : ""}
                    </div>

                    <div className={styles.name_holder}>
                        {requirementModel.displayName}
                    </div>
                </div>

                <div className={requirementModel.isAvailable ? `${styles.choose_btn_holder}` : `${styles.choose_btn_holder_hidden} ${styles.choose_btn_holder}`}>
                    <button onClick={() => requirementsManager.onRangeChoosingPressed(requirementModel)}
                            className={styles.choose_btn}>
                        {requirementModel.selectionRange ? rangeToString(requirementModel.selectionRange, requirementsManager.columnNames)
                            : requirementModel.isPending ? sharedTexts.done : sharedTexts.select}
                    </button>
                </div>
            </div>

            {requirementModel.isClassificationRequired ?
                <div className={styles.second_row}>
                    <span className={styles.positive_value}>{componentTexts.positiveValue}</span>
                    <input className={styles.classification}
                           placeholder={sharedTexts.input}
                           value={requirementModel.classification}
                           onChange={(e) => requirementModel.classification = e.target.value} />
                </div> : <></>}
        </div>
    )
})