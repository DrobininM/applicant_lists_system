import {ApplicantListPreviewModel} from "../models/applicantListPreviewModel";
import {FC} from "react";
import styles from './styles.module.css'
import edit from '../../../shared/ui/images/edit.svg'

interface IApplicationPreviewProps {
    applicationModel: ApplicantListPreviewModel;
    onEditClicked: (applicationId: number) => void;
    onRemoveClicked: (applicationId: number) => void;
}

export const ApplicationPreview: FC<IApplicationPreviewProps> = ({applicationModel, onEditClicked, onRemoveClicked}) => {
    const periodEnd = applicationModel.periodEnd;

    return (
        <div className={styles.content_holder}>
            <div className={styles.first_column}>
                <div className={styles.top_row}>
                    <span>{applicationModel.programName}</span>
                </div>

                <div className={styles.middle_row}>
                    <span>-{applicationModel.universityName + " (" + applicationModel.cityName + ")"}</span>
                    <span>-{applicationModel.fieldOfStudyName}</span>
                    <span>-{applicationModel.studyMode + ", " + applicationModel.competitionType}</span>
                </div>

                <div className={periodEnd ? `${styles.period_row}` : `${styles.period_row} + ${styles.period_actual}`}>
                    {applicationModel.periodStart.toLocaleDateString() + " - " + (periodEnd ? periodEnd.toLocaleDateString() : "...")}
                </div>
            </div>

            <div className={styles.second_column}>
                <div className={styles.buttons_holder}>
                    <div className={styles.edit_btn_holder}
                         onClick={() => onEditClicked(applicationModel.id)}>
                        <img className={styles.edit_btn}
                             draggable={false}
                             src={edit}
                             alt={"edit"} />
                    </div>

                    <div className={styles.remove_btn_holder}
                         onClick={() => onRemoveClicked(applicationModel.id)}>
                        <span className={styles.remove_holder}>&#10006;</span>
                    </div>
                </div>
            </div>
        </div>
    )
}