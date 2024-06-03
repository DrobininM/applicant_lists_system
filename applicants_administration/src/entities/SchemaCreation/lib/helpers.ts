import {SelectionRange} from "../models/selectionRange";

const alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L',
    'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

export const generateColumnNames = (columnCount: number): string[] => {
    const result = new Array<string>();

    for (let i = 0; i < Math.ceil(columnCount / alphabet.length); i++) {
        const takeCount = Math.max(columnCount - i * alphabet.length, 0)

        result.push(...alphabet.map(letter => letter.repeat(i + 1)).slice(0, takeCount))
    }

    return result;
}

export const rangeToString = (range: SelectionRange, columnNames: string[] | undefined) => {
    if (!columnNames) {
        return "";
    }

    let result = columnNames[range.columnStartIndex!] + (range.rowStartIndex! + 1);

    if (range.columnEndIndex) {
        result += " : " + columnNames[range.columnEndIndex] + (range.rowEndIndex! + 1);
    }

    return result
}