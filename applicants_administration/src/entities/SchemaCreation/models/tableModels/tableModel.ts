import {TableCellModel} from "./tableCellModel";
import {SelectionRange} from "../selectionRange";
import {makeObservable, observable} from "mobx";
import {generateColumnNames} from "../../lib/helpers";

export class TableModel {
    public isEditable: boolean = false;
    private firstSelectedCell: TableCellModel | undefined;
    private selectionRequirementId: number | undefined;
    public readonly cellModels: Set<TableCellModel> = new Set();
    public rowCount: number | undefined;
    public columnCount: number | undefined;
    public columnNames: string[] | undefined;

    constructor() {
        makeObservable(this, {
            isEditable: observable,
        })
    }

    public initializeCells(cellModels: TableCellModel[], rowCount: number, columnCount: number) {
        this.rowCount = rowCount;
        this.columnCount = columnCount;

        this.cellModels.clear();

        let rowCounter = 0;

        for (let i = 0; i < cellModels.length; i++) {
            const columnIndex = i % columnCount;

            const model = cellModels[i];

            model.rowIndex = rowCounter;
            model.columnIndex = columnIndex;

            this.cellModels.add(model);

            if (columnIndex === columnCount - 1) {
                rowCounter++;
            }
        }

        this.columnNames = generateColumnNames(columnCount);
    }

    public startSelection(requirementModelId: number) {
        this.isEditable = true;
        this.selectionRequirementId = requirementModelId;
    }

    public onCellClicked(cellModel: TableCellModel) {
        if (!this.isEditable) {
            return;
        }

        if (cellModel.isSelected && cellModel.requirementId !== this.selectionRequirementId) {
            return;
        } else if (cellModel.isSelected) {
            this.unselectCell(cellModel);

            return;
        }

        const selectedCells = this.findCellsByRequirementId(this.selectionRequirementId!);

        if (selectedCells.length === 2) {
            return;
        }

        cellModel.isSelected = true;
        cellModel.requirementId = this.selectionRequirementId!;

        if (!this.firstSelectedCell) {
            if (selectedCells.length !== 0) {
                this.firstSelectedCell = selectedCells[0];
                this.setLastCellOfSelection(cellModel);
            } else {
                this.firstSelectedCell = cellModel;
            }
        } else {
            this.setLastCellOfSelection(cellModel);
        }
    }

    public finishSelection() {
        if (!this.firstSelectedCell) {
            return;
        }

        this.firstSelectedCell = undefined;

        this.selectionRequirementId = undefined;
        this.isEditable = false;
    }

    public cancelSelection() {
        this.selectionRequirementId = undefined;
        this.isEditable = false;

        if (!this.firstSelectedCell) {
            return;
        }

        this.unselectCell(this.firstSelectedCell);

        if (this.firstSelectedCell) {
            this.unselectCell(this.firstSelectedCell);
        }
    }

    public getRange(requirementModelId: number): SelectionRange | undefined {
        const cells = this.findCellsByRequirementId(requirementModelId);

        if (cells.length === 0) {
            return undefined;
        }

        const range = new SelectionRange();

        if (cells.length === 1) {
            const cell = cells[0];

            this.setRangeStartIndexes(range, cell);
            range.pivotContent = cell.displayContent;

            return range;
        }

        const startCell = this.getStartCell(cells);
        const endCell = this.getEndCell(cells);

        this.setRangeStartIndexes(range, startCell);
        this.setRangeEndIndexes(range, endCell);

        if (!startCell.isStart && !endCell.isStart) {
            this.findCellsInRange(startCell, endCell).forEach(cell => cell.setIsInRange(true))
        }

        range.pivotContent = this.findPivotContent(startCell, endCell);

        return range;
    }

    public findCellsInRange(cell1: TableCellModel, cell2: TableCellModel): TableCellModel[] {
        const startRowIndex = Math.min(cell1.rowIndex, cell2.rowIndex);
        const endRowIndex = Math.max(cell1.rowIndex, cell2.rowIndex);
        const startColIndex = Math.min(cell1.columnIndex, cell2.columnIndex);
        const endColIndex = Math.max(cell1.columnIndex, cell2.columnIndex);

        const result = [];
        const cellModels = Array.from(this.cellModels);

        for (let j = startColIndex; j <= endColIndex; j++) {
            for (let i = startRowIndex; i <= endRowIndex; i++) {
                result.push(cellModels[i * this.columnCount! + j])
            }
        }

        return result;
    }

    private unselectCell(cellModel: TableCellModel) {
        cellModel.isSelected = false;

        const possibleRelatedCell = this.findRelatedCell(cellModel);

        if (possibleRelatedCell) {
            possibleRelatedCell.isStart = undefined;
            const cellsRange = this.findCellsInRange(possibleRelatedCell, cellModel);
            cellsRange.forEach(cell => cell.setIsInRange(false));
        }

        cellModel.requirementId = undefined;
        cellModel.isStart = undefined;

        if (this.firstSelectedCell === cellModel || this.firstSelectedCell === undefined) {
            this.firstSelectedCell = possibleRelatedCell;
        }
    }

    private findCellsByRequirementId(id: number): TableCellModel[] {
        const result = new Array<TableCellModel>();

        this.cellModels.forEach(model => {
            if (model.requirementId === id) {
                result.push(model);
            }
        })

        return result;
    }

    private findRelatedCell(cellModel: TableCellModel): TableCellModel | undefined {
        let result = undefined

        this.cellModels.forEach(model => {
            if (model.requirementId === cellModel.requirementId && model !== cellModel) {
                result = model;
            }
        })

        return result;
    }

    private setLastCellOfSelection(cellModel: TableCellModel) {
        this.firstSelectedCell!.isStart = this.firstSelectedCell!.columnIndex < cellModel.columnIndex;
        cellModel.isStart = !this.firstSelectedCell!.isStart;

        const cellsRange = this.findCellsInRange(this.firstSelectedCell!, cellModel);
        cellsRange.forEach(cell => cell.setIsInRange(true));
    }

    private getStartCell(cells: TableCellModel[]): TableCellModel {
        const found = cells.find(cell => cell.isStart === true);

        if (!found) {
            const minColIndex = Math.min(...cells.map(cell => cell.columnIndex));

            return cells.filter(cell => cell.columnIndex === minColIndex)[0]
        }

        return found
    }

    private getEndCell(cells: TableCellModel[]): TableCellModel {
        const found = cells.find(cell => cell.isStart === false)

        if (!found) {
            const maxColIndex = Math.max(...cells.map(cell => cell.columnIndex));
            const filtered = cells.filter(cell => cell.columnIndex === maxColIndex)

            return filtered[filtered.length - 1]
        }

        return found
    }

    private setRangeStartIndexes(range: SelectionRange, cell: TableCellModel) {
        range.rowStartIndex = cell.rowIndex;
        range.columnStartIndex = cell.columnIndex;
    }

    private setRangeEndIndexes(range: SelectionRange, cell: TableCellModel) {
        range.rowEndIndex = cell.rowIndex;
        range.columnEndIndex = cell.columnIndex;
    }

    private findPivotContent(cell1: TableCellModel, cell2: TableCellModel): string {
        const cellsRange = this.findCellsInRange(cell1, cell2);
        const cellsWithNotEmptyContent = cellsRange.filter(cell => cell.displayContent.trim().length !== 0);

        if (cellsWithNotEmptyContent.length === 0) {
            return "";
        }

        return cellsWithNotEmptyContent[0].displayContent;
    }
}