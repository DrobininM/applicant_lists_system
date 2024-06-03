import {TableModel} from "../../models/tableModels/tableModel";
import {FC, useMemo} from "react";
import {observer} from "mobx-react-lite";
import {SelectionTableCell} from "../SelectionTableCell/SelectionTableCell";
import styles from './styles.module.css'

interface ITableProps {
    tableModel: TableModel;
}

export const SelectionTable: FC<ITableProps> = observer(({tableModel}) => {
    if (!tableModel.columnNames) {
        return <></>
    }

    const cellModels = Array.from(tableModel.cellModels);

    const rowIndexes = useMemo(() => Array.from(Array(tableModel.rowCount).keys()),
        [tableModel, tableModel.rowCount])

    const columnIndexes = useMemo(() => Array.from(Array(tableModel.columnCount).keys()),
        [tableModel, tableModel.columnCount]);

    return (
        <div>
            <table className={styles.table} cellSpacing={0} cellPadding={0}>
                <tbody>
                <tr><td></td>{tableModel.columnNames.map((columnName, i) => <td className={styles.header_cell} key={i}>{columnName}</td>)}</tr>
                    {rowIndexes.map(i => <tr key={i}><td>{i + 1}</td>
                        {columnIndexes.map(j => <td className={styles.cell} key={i * tableModel.columnCount! + j}>
                                <SelectionTableCell key={i * tableModel.columnCount! + j}
                                                    tableCellModel={cellModels[i * tableModel.columnCount! + j]}
                                                    tableModel={tableModel} />
                            </td>)}
                    </tr>)}
                </tbody>
            </table>
        </div>
    )
})