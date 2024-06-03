export class TableCellDTO {
    cell_content: string;
    requirement_id: number | undefined;

    constructor(cellContent: string, requirementId: number | undefined) {
        this.cell_content = cellContent;
        this.requirement_id = requirementId;
    }
}