import {FC} from "react";
import styles from './styles.module.css'

interface ILabelWithInputProps {
    label: string;
    placeholder: string;
    isNumber?: boolean;
    initialValue?: string;
    onChange: (newValue: string) => void;
}


export const LabelWithInput: FC<ILabelWithInputProps> = ({label, placeholder, initialValue = "",
                                                             isNumber = false, onChange}) => {
    return (
        <div className={styles.content_holder}>
            <span className={styles.label}>{label}</span>

            <input placeholder={placeholder}
                   type={isNumber ? "number": "text"}
                   className={styles.input}
                   value={initialValue}
                   onChange={(e) => onChange(getValue(e.target.value, isNumber))} />
        </div>
    )
}

const getValue = (value: string, isNumber: boolean): string => {
    if (isNumber) {
        return value.trim().length === 0 ? "0" : value;
    }

    return value;
}