import styles from './styles.module.css'
import {PeriodModel, PeriodPreview, PeriodService} from "../../../entities/Period";
import {FC, useState} from 'react';
import {observer} from "mobx-react-lite";
import {Modal} from "@mui/material";
import {LabelWithInput} from "../../../shared/ui/InputWithLabel";
import {stringToLocalDate} from "../../../shared/lib";

interface IPeriodsProps {
    periodsService: PeriodService;
}

export const Periods: FC<IPeriodsProps> = observer(({periodsService}) => {
    const [selectedPeriod, setSelectedPeriod] = useState<PeriodModel | undefined>(undefined);
    const [dateStart, setDateStart] = useState<string | undefined>(undefined);
    const [dateEnd, setDateEnd] = useState<string | undefined>(undefined);
    const [isStartIncorrect, setIsStartIncorrect] = useState(false);
    const [isEndIncorrect, setIsEndIncorrect] = useState(false);
    const [isRangeIncorrect, setIsRangeIncorrect] = useState(false);
    const [isModalOpened, setIsModalOpened] = useState(false)

    const onAddClicked = () => {
        setIsModalOpened(true)
    }

    const onSaveClicked = () => {
        let parsedDateStart = undefined;

        try {
            parsedDateStart = stringToLocalDate(dateStart);
        } catch {}

        if (!parsedDateStart) {
            setIsStartIncorrect(true);
            setIsEndIncorrect(false);
            setIsRangeIncorrect(false);

            return;
        }

        let parsedDateEnd = undefined;

        try {
            parsedDateEnd = stringToLocalDate(dateEnd)
        } catch {}

        if ((dateEnd && !parsedDateEnd) || (!parsedDateEnd && selectedPeriod && selectedPeriod.endDate)) {
            setIsStartIncorrect(false);
            setIsEndIncorrect(true);
            setIsRangeIncorrect(false);

            return;
        }

        if (!dateEnd) {
            periodsService.addNewPeriod(parsedDateStart, undefined, selectedPeriod?.id)
                .then(() => closeModal());
        } else {
            if (parsedDateStart > parsedDateEnd!) {
                setIsStartIncorrect(false);
                setIsEndIncorrect(false);
                setIsRangeIncorrect(true);

                return
            }

            periodsService.addNewPeriod(parsedDateStart, parsedDateEnd, selectedPeriod?.id)
                .then(() => closeModal());
        }
    }

    const closeModal = () => {
        if (periodsService.isSaving) {
            return;
        }

        setIsStartIncorrect(false);
        setIsEndIncorrect(false);
        setIsRangeIncorrect(false);
        setSelectedPeriod(undefined);
        setDateStart(undefined);
        setDateEnd(undefined);
        setIsModalOpened(false);
    }

    return (
        <div className={styles.content_holder}>
            <Modal
                aria-labelledby="spring-modal-title"
                aria-describedby="spring-modal-description"
                open={isModalOpened}
                onClose={() => closeModal()}
                closeAfterTransition>
                <div className={styles.modal_content_holder}>
                    <span className={styles.adding_label}>{!selectedPeriod ? "Добавление периода поступления" : "Изменение периода поступления"}</span>

                    <div className={styles.first_row_holder}>
                        <LabelWithInput label={"Дата начала"} initialValue={dateStart} onChange={(newValue) => setDateStart(newValue)} placeholder={"Введите дату"} />
                        {isStartIncorrect ? <span className={styles.incorrect_label}>Дата имеет неверный формат</span> : <></>}
                    </div>

                    <div className={styles.first_row_holder}>
                        <LabelWithInput label={"Дата окончания"}  initialValue={dateEnd} onChange={(newValue) => setDateEnd(newValue)} placeholder={"Введите дату"} />
                        {isEndIncorrect ?
                            <span className={styles.incorrect_label}>Дата имеет неверный формат</span>
                            : <></>}
                        {isRangeIncorrect ?
                            <span className={styles.incorrect_label}>Неправильный диапазон дат</span>
                            : <></>}
                    </div>

                    <div className={styles.save_btn_holder}>
                        <button className={styles.save_btn} onClick={() => onSaveClicked()} disabled={periodsService.isSaving}>Сохранить</button>
                    </div>
                </div>
            </Modal>

            <div className={styles.top_holder}>
                <div className={styles.add_btn_holder}>
                    <button className={`${styles.add_btn}`}
                            onClick={() => onAddClicked()}>+</button>
                </div>

                <div className={styles.periods_section}>
                    <span className={styles.periods_label}>Текущие периоды</span>

                    {periodsService.store.items.filter(model => !model.endDate).length === 0 ? <span className={styles.no_content}>Активные периоды поступления отсутствуют</span>
                        : <div className={styles.periods_holder}>
                            {periodsService.store.items.filter(model => !model.endDate).map(model =>
                                <PeriodPreview key={model.id} periodModel={model}
                                               onEditClicked={_ => {setSelectedPeriod(model); setDateStart(model.startDate.toLocaleDateString());
                                                   setDateEnd(model.endDate?.toLocaleDateString()); setIsModalOpened(true)}}
                                               onRemoveClicked={_ => periodsService.removePeriod(model.id)} />)}
                        </div>}
                </div>

                <div className={styles.periods_section}>
                    <span className={styles.periods_label}>Завершённые периоды</span>

                    {periodsService.store.items.filter(model => !!model.endDate).length === 0 ? <span className={styles.no_content}>Завершённые периоды поступления отсутствуют</span>
                        : <div className={styles.periods_holder}>
                            {periodsService.store.items.filter(model => !!model.endDate).map(model =>
                                <PeriodPreview key={model.id} periodModel={model}
                                               onEditClicked={_ => {setSelectedPeriod(model); setDateStart(model.startDate.toLocaleDateString());
                                                   setDateEnd(model.endDate?.toLocaleDateString()); setIsModalOpened(true)}}
                                               onRemoveClicked={_ => periodsService.removePeriod(model.id)} />)}
                        </div>}
                </div>
            </div>
        </div>
    )
})