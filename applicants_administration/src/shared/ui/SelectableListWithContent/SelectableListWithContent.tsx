import React, {memo, ReactElement, useState} from "react";
import styles from './styles.module.css'
import {SelectableItem} from "../SelectableItem";

interface ISelectableListProps {
    items: ISelectableItem[],
    className: string,
}

interface ISelectableItem {
    id: number,
    text: string,
    component: ReactElement,
}

export const SelectableListWithContent : React.FC<ISelectableListProps> = memo(({items, className}) => {
    const [selectedElementIndex, setSelectedElementIndex] = useState(0);

    return (
        <div className={`${className} ${styles.main_container}`}>
            <div className={styles.left_main_container}>
                {items.map(item => <SelectableItem key={item.id}
                                                   id={item.id}
                                                   text={item.text}
                                                   isSelected={item.id === selectedElementIndex}
                                                   onClicked={setSelectedElementIndex}/>)}
            </div>

            <div className={styles.right_main_container}>
                {items.find(item => item.id === selectedElementIndex)?.component}
            </div>
        </div>
    )
})