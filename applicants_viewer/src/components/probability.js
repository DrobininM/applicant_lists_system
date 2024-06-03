import {memo, useState} from "react";
import getProbability from "../http/probabilityAPI";

const evaluateProbability = async (competitive_position, priority, universityName, fieldOfStudyName, city_name, program_name,
                              score_sum, budget_seats, has_priority_right, submitted_diploma) => {
    return await getProbability(competitive_position, priority, universityName, fieldOfStudyName, city_name,
        program_name, score_sum, budget_seats, has_priority_right, submitted_diploma)
}

const getPreparedProbability = (probability) => {
    if (probability) {
        const percentage = (probability * 100).toPrecision(2);

        if (percentage > 99.9) {
            return 100;
        }

        return percentage;
    }

    if (probability === 0) {
        return 0;
    }

    return "...";
}

export const Probability = memo(({competitive_position, priority, universityName, fieldOfStudyName,
                                     city_name, program_name, score_sum, budget_seats,
                                     has_priority_right, submitted_diploma}) => {
    const [, setIsCalculating] = useState(false);
    const [isCalculated, setIsCalculated] = useState(false);
    const [probability, setProbability] = useState(undefined);

    const onClick = () => {
        setIsCalculating(true);
        setIsCalculated(false);

        evaluateProbability(competitive_position, priority, universityName, fieldOfStudyName,
            city_name, program_name, score_sum, budget_seats, has_priority_right, submitted_diploma)
            .then(value => {
                setProbability(value);
                setIsCalculating(false);
                setIsCalculated(true)
            });
    }

    return (
        <div>
            <button style={{background: "#198350", color: "white", borderColor: "transparent", borderRadius: "6px"}}
                    onClick={() => onClick()}>Рассчитать</button>
            {isCalculated ?
                <div>
                    {getPreparedProbability(probability)}
                </div>
                : <></>}
        </div>
    )
})