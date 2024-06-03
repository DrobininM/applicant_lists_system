export class SelectionRangeDTO {
    start_row_index: number;
    start_column_index: number;
    end_row_index: number | undefined;
    end_column_index: number | undefined;
    pivot_content: string;

    constructor(startRowIndex: number, startColumnIndex: number, endRowIndex: number | undefined,
                endColumnIndex: number | undefined, pivotContent: string) {
        this.start_row_index = startRowIndex;
        this.start_column_index = startColumnIndex;
        this.end_row_index = endRowIndex;
        this.end_column_index = endColumnIndex;
        this.pivot_content = pivotContent;
    }
}