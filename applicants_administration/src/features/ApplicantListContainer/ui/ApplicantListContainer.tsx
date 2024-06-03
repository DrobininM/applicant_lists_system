import styles from './styles.module.css'
import {ApplicationPreview} from "../../../entities/ApplicantList";
import {FC} from "react";
import {ApplicationService} from "../../../entities/ApplicantList/models/applicationService";
import {observer} from "mobx-react-lite";
import {texts as sharedTexts} from '../../../shared/consts/texts'
import { useNavigate } from 'react-router-dom';

interface IApplicantListContainerProps {
    applicationService: ApplicationService,
}

export const ApplicantListContainer: FC<IApplicantListContainerProps> = observer(({applicationService}) => {
    const navigate = useNavigate();

    const onEditClicked = (applicationId: number) => {
        navigate("/schema_creation/" + applicationId);
    }

    const onRemoveClicked = (applicationId: number) => {
        applicationService.deleteApplication(applicationId);
    }

    return (
        <div>
            <div className={styles.top_row}>
                <span className={styles.found_holder}></span>

                <div className={styles.search_holder}>
                </div>

                <div className={styles.placeholder}></div>
            </div>

            <div className={styles.list_holder}>
                {applicationService.isLoading ? <div>Loading...</div>
                    : applicationService.store.items.map(model => <ApplicationPreview key={model.id}
                                                                                      applicationModel={model}
                                                                                      onEditClicked={onEditClicked}
                                                                                      onRemoveClicked={onRemoveClicked} />)}
            </div>

            <div className={styles.bottom_row}>

            </div>
        </div>
    )
})