import {texts as componentTexts} from '../consts/texts';
import styles from './styles.module.css'
import {ApplicationSchemaService} from "../../../entities/SchemaCreation";
import {FC, useState} from "react";
import {FileSelection} from "../../../shared/ui/FileSelection";
import {SchemaCreationTable} from "../../../features/SchemaCreationTable/ui/SchemaCreationTable";
import CircularProgress from '@mui/material/CircularProgress';
import {observer} from "mobx-react-lite";
import {texts as sharedTexts} from '../../../shared/consts/texts';
import {Modal} from "@mui/material";
import {useNavigate} from "react-router-dom";

interface ISchemaCreationTableProps {
    mainService: ApplicationSchemaService;
    isEditing?: boolean;
}

export const SchemaCreationTableSection: FC<ISchemaCreationTableProps> = observer(({mainService, isEditing = true}) => {
    const [isFileIncorrect, setIsFileIncorrect] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const navigate = useNavigate();

    const onFileChosen = (file: File | undefined) => {
        if (file === undefined){
            setIsFileIncorrect(true);

            return;
        }

        setIsFileIncorrect(false);

        mainService.loadProcessedFileToStore(file);
    }

    const onSaveClicked = () => {
        setIsSaving(true)
        mainService.createApplicationSchema(isEditing).then(value => {
            if (value) {
                navigate("/");
                window.location.reload();
            } else {
                setIsSaving(false)
            }
        })
    }

    return (
        <div>
            <Modal open={isSaving}>
                <div className={styles.modal_holder}>
                    <CircularProgress color={"success"} />
                </div>
            </Modal>

            <span className={styles.label}>{componentTexts.markupTable}</span>

            <div className={styles.file_section}>
                <div>
                    <FileSelection onFileChosen={onFileChosen}
                                   extensionList={[".xlsx", ".xls", ".html", ".htm"]} />

                    {isFileIncorrect ? <span className={styles.incorrect_msg}>{componentTexts.incorrectFile}</span> : <></> }
                </div>

                <div className={mainService.schemaStore.chosenFile !== undefined || isEditing
                    ? `${styles.save_btn_holder}` : `${styles.save_btn_holder} ${styles.invisible_btn_holder}`}>
                    <button disabled={!getIsSaveEnabled(mainService)}
                            className={styles.save_btn}
                            onClick={() => onSaveClicked()}>{sharedTexts.save}</button>
                </div>
            </div>

            {mainService.isLoading ?
                <div className={styles.loading_holder}><CircularProgress color="success" /></div> :
                <div className={styles.table_holder}>
                    <SchemaCreationTable tableModel={mainService.tableModel}
                                         requirementsManager={mainService.requirementsManager}/>
                </div>}
        </div>
    )
})

const getIsSaveEnabled = (mainService: ApplicationSchemaService) => {
    const requirementsManager = mainService.requirementsManager;

    if (!mainService.tableModel || !requirementsManager) {
        return false;
    }

    const schemaStore = mainService.schemaStore;

    const stringNames = [schemaStore.cityName, schemaStore.universityName, schemaStore.fieldOfStudyName, schemaStore.programName]

    if (stringNames.filter(name => !name).length > 0 || !schemaStore.enrollmentPeriodId || !schemaStore.studyModeId
        || !schemaStore.competitionTypeId) {
        return false;
    }

    if (stringNames.filter(name => checkIsTextEmpty(name!)).length > 0) {
        return false;
    }

    if (schemaStore.budgetSeats < 0 || schemaStore.commercialSeats < 0 || schemaStore.targetedSeats < 0) {
        console.log("budget " + schemaStore.budgetSeats)
        return false;
    }

    if (!mainService.periodService.store.findItemById(schemaStore.enrollmentPeriodId)?.endDate
        && (!schemaStore.applicationLink || checkIsTextEmpty(schemaStore.applicationLink))) {
        return false;
    }

    const requirements = requirementsManager.requirementModels.filter(model => !model.relatedRequirementId);

    if (requirements.filter(model => !model.selectionRange || checkIsTextEmpty(model.displayName)).length > 0
        || requirements.filter(model => model.isSubject).length === 0
        || requirements.filter(model => model.isClassificationRequired && (!model.classification || checkIsTextEmpty(model.classification))).length > 0) {
        return false;
    }

    if (!requirementsManager.selectedSubstitutionId) {
        return false;
    }

    const selected = requirementsManager.requirementModels.find(model => model.id === requirementsManager.selectedSubstitutionId);

    if (!selected || !selected.selectionRange
        || (selected.isClassificationRequired && (!selected.classification || checkIsTextEmpty(selected.classification)))) {
        return false;
    }

    return true;
}

const checkIsTextEmpty = (text: string): boolean => {
    return text.trim().length === 0;
}