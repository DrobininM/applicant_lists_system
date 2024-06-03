import {useNavigate, useParams} from "react-router-dom";
import {ApplicationSchemaService} from "../../../entities/SchemaCreation";
import {FC, useEffect, useState} from "react";
import {SchemaCreationInfo} from "../../../widgets/SchemaCreationInfo";
import {observer} from "mobx-react-lite";
import styles from './styles.module.css'
import {texts as sharedTexts} from '../../../shared/consts/texts'
import {texts as pageTexts} from '../consts/texts'
import {NavBar} from "../../../widgets/Navbar";
import {SchemaCreationTableSection} from "../../../widgets/SchemaCreationTable";
import CircularProgress from "@mui/material/CircularProgress";

const mainService = new ApplicationSchemaService();

export const SchemaCreationPage = observer(() => {
    const [isLoading, setIsLoading] = useState(true);
    const { applicationId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        mainService.reload();

        if (applicationId) {
            console.log("edit load")
            mainService.loadApplicationSchemaToStore(Number(applicationId)).then(() => {
                setIsLoading(false);
                mainService.schemaStore.applicationId = Number(applicationId);
            })
        } else {
            console.log("reloaded")
            setIsLoading(false);
        }
    }, [applicationId])

    if (isLoading) {
        return (
            <div className={styles.loading_holder}>
                <CircularProgress />
            </div>
        )
    }

    return (
        <div>
            <NavBar navbarDescription={!applicationId ? pageTexts.addingLabel : pageTexts.editingLabel}
                    children={
                <div className={styles.back_btn_holder}>
                    <button className={styles.back_btn} onClick={() => {navigate('/'); window.location.reload()}}>{sharedTexts.back} &#129094;</button>
                </div>} />

            <div className={styles.content_holder}>
                <div className={styles.info_content_holder}>
                    <SchemaCreationInfo mainService={mainService} />
                </div>

                <div className={styles.table_content_holder}>
                    <SchemaCreationTableSection mainService={mainService} isEditing={!!applicationId} />
                </div>
            </div>
        </div>
    )
})