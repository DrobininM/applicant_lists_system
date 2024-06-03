import Select, {ActionMeta, SingleValue } from "react-select";
import React, {FC, memo} from "react";
import { texts } from "../../consts";

interface IComboBoxProps {
    options: {value:any, label:any}[];
    placeholder: string;
    selectedValue?: {value:any, label:any};
    isEditable?: boolean;
    onChange: (newOption: {value: any, label: any} | null) => void;
    isLoading?: boolean;
    isClearable?: boolean;
}

const getNoResultMessage = () => texts.comboBoxNoResult;

export const ComboBox: FC<IComboBoxProps> =
    memo(({options, placeholder, selectedValue, isEditable = true, onChange, isLoading = false, isClearable = true}) => {
    return (
        <Select options={options}
                placeholder={placeholder}
                isClearable={isClearable}
                isDisabled={!isEditable}
                noOptionsMessage={getNoResultMessage}
                value={selectedValue}
                onChange={(newValue) => onChange(newValue ? {value: newValue.value, label: newValue.label} : null)}
                isLoading={isLoading} />
    )
})