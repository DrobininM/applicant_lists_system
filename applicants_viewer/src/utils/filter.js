import {calcSumOfApplicationSubjects} from "./utils";
import {searchOptions} from "../components/search/search";

export const conditions = ["greater", "less"]

export function filterApplicationBySumScore(ap, point, condition) {
    let appropriateIndexes = []

    let count = ap.position_list.length;
    for (let i = 0; i < count; i++) {
        let sum = calcSumOfApplicationSubjects(ap.list_of_subject_values[i], ap.extra_score_list[i])

        if (condition === conditions[0]) {
            if (sum <= point) {
                appropriateIndexes.push(i)
            }
        } else {
            if (sum >= point) {
                appropriateIndexes.push(i)
            }
        }
    }

    return getApplicationDataByIndexes(appropriateIndexes, ap);
}

export function getApplicationDataByIndexes(appropriateIndexes, ap) {
    return [{
        position_list: appropriateIndexes.map(i => ap.position_list[i]),
        insurance_number_list: appropriateIndexes.map(i => ap.insurance_number_list[i]),
        list_of_subject_values: appropriateIndexes.map(i => ap.list_of_subject_values[i]),
        extra_score_list: appropriateIndexes.map(i => ap.extra_score_list[i]),
        agreement_list: appropriateIndexes.map(i => ap.agreement_list[i]),
        priority_list: appropriateIndexes.map(i => ap.priority_list[i]),
        original_document_list: appropriateIndexes.map(i => ap.original_document_list[i]),
        has_special_right_list: appropriateIndexes.map(i => ap.has_special_right_list[i]),
        list_of_other_programs: appropriateIndexes.map(i => ap.list_of_other_programs[i])
    }]
}

export function filterApplicationByInsuranceNumber(ap, insuranceNumber) {
    let appropriateIndexes = []

    let count = ap.position_list.length;
    for (let i = 0; i < count; i++) {
        if (ap.insurance_number_list[i].includes(insuranceNumber)) {
            appropriateIndexes.push(i);
        }
    }

    return getApplicationDataByIndexes(appropriateIndexes, ap);
}

export function filterApplicationByPosition(ap, position) {
    let appropriateIndexes = []

    let count = ap.position_list.length;
    for (let i = 0; i < count; i++) {
        if (ap.position_list[i].toString() === position) {
            appropriateIndexes.push(i);
        }
    }
    console.log("apr", appropriateIndexes)
    return getApplicationDataByIndexes(appropriateIndexes, ap);
}

export function filterApplicationBySum(ap, sumInput) {
    let appropriateIndexes = []

    let count = ap.position_list.length;
    for (let i = 0; i < count; i++) {
        let sum = calcSumOfApplicationSubjects(ap.list_of_subject_values[i], ap.extra_score_list[i])

        if (sum.toString() === sumInput) {
            appropriateIndexes.push(i);
        }
    }

    return getApplicationDataByIndexes(appropriateIndexes, ap);
}

export function filterApplicationByOtherPrograms(ap, otherProgramInput) {
    let appropriateIndexes = []

    let count = ap.position_list.length;
    for (let i = 0; i < count; i++) {
        let otherPrograms = ap.list_of_other_programs[i];

        for (let j = 0; j < otherPrograms.length; j++) {
            let otherProgram = otherPrograms[j]

            otherProgramInput.split(' ').forEach(word => {
            if (otherProgram[1].includes(word.trim()) || otherProgram[3].includes(word.trim()) || otherProgram[5].includes(word.trim())) {
                if (!appropriateIndexes.includes(i)) {
                    appropriateIndexes.push(i);
                }
            }})
        }
    }

    return getApplicationDataByIndexes(appropriateIndexes, ap);
}

export function filterBySearchType(ap, input, searchType) {
    if (input.trim() === "") {
        return [ap];
    }
    console.log(searchType)
    // INSURANCE
    if (searchType === searchOptions[0].value) {
        return filterApplicationByInsuranceNumber(ap, input);
    }

    // POSITION
    if (searchType === searchOptions[1].value) {
        return filterApplicationByPosition(ap, input);
    }

    // SUM
    if (searchType === searchOptions[2].value) {
        return filterApplicationBySum(ap, input);
    }

    // OTHER PROGRAMS
    // if (searchType === searchOptions[3].value) {
    //     return filterApplicationByOtherPrograms(ap, input);
    // }

    return [ap];
}