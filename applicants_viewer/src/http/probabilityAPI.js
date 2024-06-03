import {PROBABILITY_ROUTE} from "../consts/urls";
import axios from "axios";

export default async function getProbability(competitive_position, priority, universityName, fieldOfStudyName, city_name, programName,
                                             score_sum, budgetSeats, has_priority_right, submitted_diploma) {
    const {data} = await axios.create({
        baseURL: process.env.REACT_APP_ML_API_URL
    }).post(PROBABILITY_ROUTE, {
        city_name: city_name,
        university_name: universityName,
        field_of_study_name: fieldOfStudyName,
        program_name: programName,
        score_sum: score_sum,
        budget_seats: budgetSeats,
        submitted_diploma: submitted_diploma,
        has_priority_right: has_priority_right,
        priority: priority,
        competitive_position: competitive_position
    })

    console.log(data)

    return data
}