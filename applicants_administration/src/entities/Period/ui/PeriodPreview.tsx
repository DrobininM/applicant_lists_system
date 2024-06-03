import {PeriodModel} from "../models/periodModel";
import {FC} from "react";
import styles from "./styles.module.css";
import edit from "../../../shared/ui/images/edit.svg";

interface IPeriodPreviewProps {
    periodModel: PeriodModel;
    onEditClicked: (periodId: number) => void;
    onRemoveClicked: (periodId: number) => void;
}

export const PeriodPreview: FC<IPeriodPreviewProps> = ({periodModel, onEditClicked, onRemoveClicked}) => {
    return (
        <div className={styles.content_holder}>
            <div className={styles.first_column}>
                <div className={styles.period_row}>
                    {periodModel.startDate.toLocaleDateString() + " - " + (periodModel.endDate ? periodModel.endDate.toLocaleDateString() : "...")}
                </div>
            </div>

            <div className={styles.second_column}>
                <div className={styles.buttons_holder}>
                    <div className={styles.edit_btn_holder}
                         onClick={() => onEditClicked(periodModel.id)}>
                        <img className={styles.edit_btn}
                             draggable={false}
                             src={edit}
                             alt={"edit"} />
                    </div>

                    <div className={styles.remove_btn_holder}
                         onClick={() => onRemoveClicked(periodModel.id)}>
                        <span className={styles.remove_holder}>&#10006;</span>
                    </div>
                </div>
            </div>
        </div>
    )
}