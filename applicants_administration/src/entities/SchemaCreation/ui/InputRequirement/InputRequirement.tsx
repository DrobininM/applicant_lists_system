import {FC} from "react";
import {observer} from "mobx-react-lite";
import {rangeToString} from "../../lib/helpers";
import {texts as sharedTexts} from "../../../../shared/consts";
import {texts as componentTexts} from "../../consts/texts";
import styles from './styles.module.css'
import { IRequirementProps } from "../Requirement/Requirement";
import {removeFromArray} from "../../../../shared/lib";

export const InputRequirement: FC<IRequirementProps> = observer(({requirementModel, requirementsManager}) => {
    const onRemoveClicked = () => {
        removeFromArray(requirementsManager.requirementModels, requirementModel);
    }

    return (
        <div className={styles.content_holder}>
            <div className={styles.first_column}>
                <div className={styles.name_with_check_holder}>
                    <div className={styles.check_holder}>
                        {requirementModel.selectionRange ? "+" : ""}
                    </div>

                    <div className={styles.name_holder}>
                        <input placeholder={sharedTexts.inputName}
                               onChange={(e) => requirementModel.displayName = e.target.value}
                               value={requirementModel.displayName}
                               className={styles.input} />
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

            <div className={styles.second_column}>
                <button onClick={() => onRemoveClicked()}>&#10006;</button>
            </div>
        </div>
    )
})