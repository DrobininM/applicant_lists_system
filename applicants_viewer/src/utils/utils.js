export function calcSumOfApplicationSubjects(pointsList, extraPoint) {
    let sum = extraPoint;

    pointsList.forEach(point => sum += point);

    return sum;
}