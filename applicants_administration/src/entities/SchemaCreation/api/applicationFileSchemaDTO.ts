import {RequirementDTO} from "./requirementDTO";
import {TableCellDTO} from "./tableCellDTO";

export class ApplicationFileSchemaDTO {
    requirements: RequirementDTO[];
    selection_cells: TableCellDTO[];
    row_count: number;
    column_count: number;

    constructor(requirements: RequirementDTO[], selectionCells: TableCellDTO[], rowCount: number, columnCount: number) {
        this.requirements = requirements;
        this.selection_cells = selectionCells;
        this.row_count = rowCount;
        this.column_count = columnCount;
    }
}