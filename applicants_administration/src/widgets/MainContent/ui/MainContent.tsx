import {ApplicantLists} from "../../ApplicantLists";
import {Periods} from "../../Periods";
import {SelectableListWithContent} from "../../../shared/ui/SelectableListWithContent";
import styles from './styles.module.css'
import {MainStore} from "../../../entities/MainStore/models/mainStore";

const mainStore = new MainStore();
mainStore.loadAll();

const selectableListData = [
    {
        id: 0,
        text: "Списки",
        component: <ApplicantLists mainStore={mainStore} />,
    },
    {
        id: 1,
        text: "Периоды поступления",
        component: <Periods periodsService={mainStore.periodService} />,
    }
];

export const MainContent = () => {
    return (
        <SelectableListWithContent items={selectableListData} className={styles.content} />
    )
}