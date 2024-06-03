import {ApplicationSchemaService} from "../../../entities/SchemaCreation";
import {FC, useState} from "react";
import {ComboBox} from "../../../shared/ui/ComboBox";
import {convertEntityToOption} from "../../../shared/lib";
import {texts as sharedTexts} from '../../../shared/consts'
import {texts as componentTexts} from '../consts/texts'
import { StoreService } from "../../../shared/models/store";
import {NamedEntity} from "../../../shared/models/entity";
import {observer} from "mobx-react-lite";
import {LabelWithInput} from "../../../shared/ui/InputWithLabel";
import styles from './styles.module.css'
import {getCanProcessFile} from "../../../entities/SchemaCreation/api/schemaAPI";
import {LinearProgress} from "@mui/material";

interface ISchemaCreationInfoProps {
    mainService: ApplicationSchemaService;
}

export const SchemaCreationInfo: FC<ISchemaCreationInfoProps> = observer(({mainService}) => {
    const [isFileCorrect, setIsFileCorrect] = useState<boolean | undefined>(undefined);
    const [isFileChecking, setIsFileChecking] = useState(false)

    const schemaStore = mainService.schemaStore;
    const periodService = mainService.periodService;
    const studyModeService = mainService.studyModeService;
    const competitionTypeService = mainService.competitionTypeService;

    const onCheckButtonClicked = () => {
        if (isFileChecking) {
            return;
        }

        setIsFileChecking(true);

        getCanProcessFile(schemaStore.applicationLink!).then((result) => {
            setIsFileCorrect(result);

            setIsFileChecking(false);
        })
    }

    return (
        <div className={styles.content_holder}>
            <div className={styles.column}>
                <div className={styles.column_content_holder}>
                    <LabelWithInput label={sharedTexts.city}
                                    placeholder={sharedTexts.name}
                                    initialValue={schemaStore.cityName}
                                    onChange={(newValue) => schemaStore.cityName = newValue} />
                </div>

                <div className={styles.column_content_holder}>
                    <LabelWithInput label={sharedTexts.university}
                                    placeholder={sharedTexts.name}
                                    initialValue={schemaStore.universityName}
                                    onChange={(newValue) => schemaStore.universityName = newValue} />
                </div>

                <div className={styles.column_content_holder}>
                    <LabelWithInput label={sharedTexts.fieldOfStudy}
                                    placeholder={sharedTexts.name}
                                    initialValue={schemaStore.fieldOfStudyName}
                                    onChange={(newValue) => schemaStore.fieldOfStudyName = newValue} />
                </div>

                <div className={styles.column_content_holder}>
                    <LabelWithInput label={sharedTexts.program}
                                    placeholder={sharedTexts.name}
                                    initialValue={schemaStore.programName}
                                    onChange={(newValue) => schemaStore.programName = newValue} />
                </div>

                <div className={styles.column_content_holder}>
                    <LabelWithInput label={sharedTexts.budget}
                                    placeholder={sharedTexts.input}
                                    isNumber={true}
                                    initialValue={String(schemaStore.budgetSeats)}
                                    onChange={(newValue) => schemaStore.budgetSeats = Number(newValue)} />
                </div>
            </div>

            <div className={styles.column}>
                <div className={styles.column_content_holder}>
                    <span className={styles.combobox_label}>{sharedTexts.choosePeriod}</span>

                    <ComboBox options={periodService.store.items.map(convertEntityToOption)}
                              selectedValue={getSelectedOption(schemaStore.enrollmentPeriodId, periodService)}
                              placeholder={sharedTexts.choose}
                              isLoading={periodService.isLoading}
                              onChange={(newOption) => {
                                  if (!newOption || !periodService.store.findItemById(newOption.value)?.endDate) {
                                      schemaStore.applicationLink = undefined;
                                  }

                                  schemaStore.enrollmentPeriodId = newOption?.value;
                              }} />
                </div>

                <div className={styles.column_content_holder}>
                    <span className={styles.combobox_label}>{sharedTexts.chooseStudyMode}</span>

                    <ComboBox options={studyModeService.store.items.map(convertEntityToOption)}
                              selectedValue={getSelectedOption(schemaStore.studyModeId, studyModeService)}
                              placeholder={sharedTexts.choose}
                              isLoading={studyModeService.isLoading}
                              onChange={(newOption) => schemaStore.studyModeId = newOption?.value} />
                </div>

                <div className={styles.column_content_holder}>
                    <span className={styles.combobox_label}>{sharedTexts.chooseCompetitionType}</span>

                    <ComboBox options={competitionTypeService.store.items.map(convertEntityToOption)}
                              selectedValue={getSelectedOption(schemaStore.competitionTypeId, competitionTypeService)}
                              placeholder={sharedTexts.choose}
                              isLoading={competitionTypeService.isLoading}
                              onChange={(newOption) => schemaStore.competitionTypeId = newOption?.value} />
                </div>

                <div className={styles.column_content_holder}>
                    <LabelWithInput label={sharedTexts.commercial}
                                    placeholder={sharedTexts.input}
                                    isNumber={true}
                                    initialValue={String(schemaStore.commercialSeats)}
                                    onChange={(newValue) => schemaStore.commercialSeats = Number(newValue)} />
                </div>

                <div className={styles.column_content_holder}>
                    <LabelWithInput label={sharedTexts.targeted}
                                    placeholder={sharedTexts.input}
                                    isNumber={true}
                                    initialValue={String(schemaStore.targetedSeats)}
                                    onChange={(newValue) => {schemaStore.targetedSeats = Number(newValue)}} />
                </div>

                {schemaStore.enrollmentPeriodId !== undefined && periodService.store.findItemById(schemaStore.enrollmentPeriodId)?.endDate === undefined ?
                <div className={styles.column_content_holder}>
                    <LabelWithInput label={componentTexts.actualLink}
                                    placeholder={sharedTexts.input}
                                    initialValue={schemaStore.applicationLink}
                                    onChange={(newValue) => {
                                        schemaStore.applicationLink = newValue;
                                        setIsFileCorrect(undefined)
                                    }} />

                    <div className={styles.check_btn_holder}>
                        <button className={styles.check_btn}
                                disabled={!schemaStore.applicationLink || isFileChecking}
                                onClick={() => onCheckButtonClicked()}>{sharedTexts.check}</button>
                        <div className={styles.msg_holder}>
                            {isFileChecking ? <LinearProgress className={styles.progress_holder} color={"warning"} />
                                : isFileCorrect !== undefined ?
                                    <span className={isFileCorrect ? styles.success_msg : styles.fail_msg}>
                                        {isFileCorrect ? componentTexts.success : componentTexts.fail}
                                    </span>
                                    : <></>}
                        </div>
                    </div>
                </div>
                    :  <></>}
            </div>
        </div>
    )
})

function getSelectedOption<TItem extends NamedEntity>(selectedId: number | undefined, service: StoreService<TItem>) {
    if (!selectedId) {
        return undefined;
    }

    const item = service.store.findItemById(selectedId);

    if (!item) {
        return undefined;
    }

    return convertEntityToOption(item);
}