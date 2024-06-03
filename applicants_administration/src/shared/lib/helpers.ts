import {NamedEntity} from "../models/entity";

export const convertEntityToOption = (entity: NamedEntity) => {
    return {value: entity.id, label: entity.displayName, }
}

export const removeFromArray = (array: any[], element: any) => {
    const index = array.indexOf(element);

    if (index > -1) {
        array.splice(index, 1);
    }
}

export const convertTwoDatesToRange = (startDate: Date, endDate: Date | undefined) => {
    const start = convertDate(startDate);

    if (!endDate) {
        return start + " - ...";
    }

    return start + " - " + convertDate(endDate);
}

const convertDate = (date: Date) => {
    const month = new Intl.DateTimeFormat('ru', { month: 'short' }).format(date);
    const year = new Intl.DateTimeFormat('ru', { year: 'numeric' }).format(date);

    return month + " " + year;
}

export const stringToLocalDate = (text: string | undefined): Date | undefined => {
    if (!text) {
        return undefined;
    }

    const parts = text.split(".")

    const date = new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]))

    if (isNaN(date.getTime())) {
        return undefined;
    }

    return date;
}