import React, {memo} from "react";
import styles from './styles.module.css'

interface ISelectableItemProps {
    id: number,
    text: string,
    isSelected: boolean,
    onClicked: (id: number) => void,
}

export const SelectableItem: React.FC<ISelectableItemProps> = memo(({id, text, isSelected, onClicked}) => {
    return (
        <div className={isSelected ? `${styles.container_selected} ${styles.container}` : styles.container}
             onClick={() => onClicked(id)}>
            {text}
        </div>
    )
})