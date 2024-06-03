import {TableCellModel} from "../../models/tableModels/tableCellModel";
import {FC} from "react";
import {observer} from "mobx-react-lite";
import {TableModel} from "../../models/tableModels/tableModel";
import styles from './styles.module.css'

interface ITableCellProps {
    tableCellModel: TableCellModel;
    tableModel: TableModel;
}

const getClassName = (cellModel : TableCellModel) => {
    let className = `${styles.cell}`;

    if (!cellModel.isSelected && !cellModel.isInRange) {
        return className;
    }

    className += ` ${styles.selected_cell}`

    return className;
}

export const SelectionTableCell: FC<ITableCellProps> =
    observer(({tableCellModel, tableModel}) => {
    return (
        <div onClick={() => tableModel.onCellClicked(tableCellModel)}
             className={getClassName(tableCellModel)}>
            {tableCellModel.displayContent}
        </div>
    )
})