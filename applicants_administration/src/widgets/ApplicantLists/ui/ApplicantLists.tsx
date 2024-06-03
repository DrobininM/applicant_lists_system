import {AsyncComboBox, ComboBox} from "../../../shared/ui/ComboBox";
import {PartialService} from "../../../shared/models/store";
import {NamedEntity} from "../../../shared/models/entity";
import axios from "axios";
import styles from './styles.module.css'
import {texts as componentTexts} from "../consts/consts";
import {texts as sharedTexts} from '../../../shared/consts'
import tooltipStyles from '../../../shared/styles/tooltip.module.css'
import {MainStore} from "../../../entities/MainStore/models/mainStore";
import {FC, useEffect, useMemo, useState} from "react";
import {convertEntityToOption} from "../../../shared/lib";
import {observer} from "mobx-react-lite";
import {ApplicantListContainer} from "../../../features/ApplicantListContainer";
import {ApplicationService} from "../../../entities/ApplicantList/models/applicationService";
import {useNavigate} from "react-router-dom";
import {Pagination} from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";

interface IApplicantListsProps {
    mainStore: MainStore;
}

const maxItemCountOnPage = 10;

const applicationService = new ApplicationService();
applicationService.load(0, maxItemCountOnPage);

export const ApplicantLists: FC<IApplicantListsProps> = observer(({mainStore}) => {
    const [pageNumber, setPageNumber] = useState(1);
    const [searchText, setSearchText] = useState("");

    const navigate = useNavigate();

    // const universityService = mainStore.universityService;
    const fieldOfStudyService = mainStore.fieldOfStudyService;
    // const periodService = mainStore.periodService;

    useEffect(() => {
        return () => {
            fieldOfStudyService.store.clear();
        }
    }, [fieldOfStudyService])

    const onAddClicked = () => {
        navigate("/schema_creation");
    }

    const loadStore = (newPageNumber: number, newSearchText: string) => {
        if (newSearchText.length === 0) {
            applicationService.load((newPageNumber - 1) * maxItemCountOnPage, maxItemCountOnPage);
        } else {
            applicationService.load((newPageNumber - 1) * maxItemCountOnPage, maxItemCountOnPage, {programName: newSearchText});
        }
    }

    const onPageChanged = (newPageNumber: number, newSearchText: string = "") => {
        applicationService.store.clear();
        loadStore(newPageNumber, newSearchText);

        setPageNumber(newPageNumber);
    };

    const onSearchInputChanged = (newValue: string) => {
        onPageChanged(1, newValue);

        setSearchText(newValue);
    }

    return (
        <div className={styles.content_holder}>
            <div className={styles.top_holder}>
                <div className={styles.add_btn_holder}>
                    <button className={`${styles.add_btn}`}
                            onClick={() => onAddClicked()}>
                        +<span className={tooltipStyles.tooltip}>{componentTexts.addNewList}</span>
                    </button>
                </div>
            </div>

            <div className={styles.search_holder}>
                <input className={styles.search_input}
                       placeholder={componentTexts.searchByProgram}
                       onChange={(e) => onSearchInputChanged(e.target.value)} />
            </div>

            {applicationService.store.totalCount === 0 ?
                <div className={styles.placeholder}>{componentTexts.applicantListsNotFound}</div>
                : <>
                    <div className={styles.pagination_holder}>
                        <Pagination count={calculatePageCount(applicationService.store.totalCount)}
                                    onChange={(e, page) => onPageChanged(page)}
                                    defaultValue={pageNumber} />
                    </div>

                    {applicationService.isLoading ? <div className={styles.progress_holder}><CircularProgress /></div> :
                        <div className={styles.list_container}>
                            <ApplicantListContainer applicationService={applicationService} />
                        </div>
                    }
                </>}
        </div>
    )
})

const calculatePageCount = (totalCount: number) => {
    return Math.ceil(totalCount / maxItemCountOnPage)
}