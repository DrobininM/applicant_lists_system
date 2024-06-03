import TableHead from "./tableHead";
import TableBody from "./tableBody";
import {tableTitlesBeforeSubjects, tableTitlesAfterSubjects} from "../../consts/strings";
import {ApplicationContext} from "../../App";
import {observer} from "mobx-react-lite";
import "./styles.css"
import {useContext} from "react";
import {WITHOUT_EXAMS} from "../../consts/strings";
import {calcSumOfApplicationSubjects} from "../../utils/utils";
import {conditions, filterApplicationBySumScore, filterBySearchType} from "../../utils/filter";
import {SearchContext} from "./tableWithInfoAndSearch";
import OtherProgramLink from "./otherProgramLink";
import {Probability} from "../probability";

const useApplicationContext = () => useContext(ApplicationContext);
const useSearchContext = () => useContext(SearchContext)

const Table = observer(() => {
    const {
        application, applicationInfo, doHideEmptyOp, doHighlightAgreement, doHighlightDoc, doHighlightManyAgreements,
        doHighlightGreaterSum, doHighlightLessSum, doHideGreaterSum, doHideLessSum
    } = useApplicationContext();

    const {searchText, searchOptionId} = useSearchContext();

    if (application.applications.length === 0) {
        return <div></div>
    }

    const prepareBoolParameter = (val) => {
        if (val) {
            return "ДА";
        }

        return <div></div>
    }

    const getDoHighlightAgreement = (doesAgree) => {
        return doHighlightAgreement && doesAgree;
    }

    const getDoHighlightDoc = (didBring) => {
        return doHighlightDoc && didBring;
    }

    const getDoHighlightManyAgreements = (curAgreement, otherPrograms) => {
        if (!doHighlightManyAgreements) {
            return false;
        }

        let agreementCount = curAgreement ? 1 : 0;

        otherPrograms.forEach(program => {
            if (program[11] === "True") agreementCount++
        })

        return agreementCount > 1;
    }

    const getDoHighlightGreaterSum = (sum) => {
        return sum > doHighlightGreaterSum;
    }

    const getDoHighlightLessSum = (sum) => {
        return sum < doHighlightLessSum;
    }

    let ap;

    if (!doHideEmptyOp) {
        ap = application.applications;
    } else {
        ap = application.withoutEmptyOtherOp;
    }

    if (doHideGreaterSum !== Number.MAX_SAFE_INTEGER) {
        ap = filterApplicationBySumScore(ap, doHideGreaterSum, conditions[0])[0]
    }

    if (doHideLessSum !== Number.MIN_SAFE_INTEGER) {
        ap = filterApplicationBySumScore(ap, doHideLessSum, conditions[1])[0]
    }

    ap = filterBySearchType(ap, searchText, searchOptionId)[0];

    if (!ap) {
        return <div></div>
    }

    const subj_count = application.subjectNames.length
    const applicationCount = ap.position_list.length;

    const rows = Array.from(Array(applicationCount).keys())
        .map(i => {
            const sum = calcSumOfApplicationSubjects(ap.list_of_subject_values[i], ap.extra_score_list[i]);

            const result = {
                id: i,
                doHighlightAgreement: getDoHighlightAgreement(ap.agreement_list[i]),
                doHighlightDoc: getDoHighlightDoc(ap.original_document_list[i]),
                doHighlightManyAgreements: getDoHighlightManyAgreements(ap.agreement_list[i], ap.list_of_other_programs[i]),
                doHighlightGreaterSum: getDoHighlightGreaterSum(sum),
                doHighlightLessSum: getDoHighlightLessSum(sum),
                values: [{id: i + 1, value: ap.position_list[i]}, {
                    id: i + 2,
                    value: <div style={{fontSize: "14px"}}>{ap.insurance_number_list[i]}</div>
                },
                    ...ap.list_of_subject_values[i].map((val, j) => {
                        return {id: i + j + 3, value: val}
                    }),
                    {id: i + subj_count + 3, value: ap.extra_score_list[i]},
                    {id: i + subj_count + 4, value: sum},
                    {
                        id: i + subj_count + 5,
                        value: !ap.priority_list[i] ? prepareBoolParameter(ap.agreement_list[i]) : ap.priority_list[i]
                    },
                    {id: i + subj_count + 6, value: prepareBoolParameter(ap.original_document_list[i])}, {
                        id: i + subj_count + 7,
                        value: prepareBoolParameter(ap.has_special_right_list[i])
                    }]
            }

            if (!applicationInfo.info.application.enrollment_period.period_end_date) {
                result.values.push(
                {id: i + subj_count + 8, value: <Probability competitive_position={ap.position_list[i]}
                                                             budget_seats={applicationInfo.info.application.budget_seats}
                                                             city_name={applicationInfo.info.application.university.city_name}
                                                             program_name={applicationInfo.info.application.program.program_name}
                                                             fieldOfStudyName={applicationInfo.info.application.field_of_study.field_of_study_name}
                                                             has_priority_right={ap.has_special_right_list[i]}
                                                             priority={ap.priority_list[i]} score_sum={sum} submitted_diploma={ap.original_document_list[i]}
                                                             universityName={applicationInfo.info.application.university.university_name} />})
            }

            return result
        })

    let afterSubjects = [...tableTitlesAfterSubjects]

    if (!!ap.priority_list[0]) {
        afterSubjects[2] = "Приоритет";
    }

    if (!!applicationInfo.info.application.enrollment_period.period_end_date) {
        afterSubjects = [...afterSubjects.slice(0, afterSubjects.length - 1)]
    }

    const colNames = [...tableTitlesBeforeSubjects, ...application.subjectNames, ...afterSubjects]

    const columns = colNames.map((col_title, i) => {
        return {id: i, title: col_title}
    });

    return (
        <table id="tableRes" style={{background: "white", borderRadius: "15px", width: "100%"}}>
            <TableHead columns={columns}/>
            <TableBody rows={rows} tableColor={"white"}/>
        </table>
    )
})

export default Table;