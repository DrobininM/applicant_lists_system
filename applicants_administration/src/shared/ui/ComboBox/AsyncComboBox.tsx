import {PartialService} from "../../models/store";
import {NamedEntity} from "../../models/entity";
import {FC, useEffect, useState} from "react";
import {observer} from "mobx-react-lite";
import {convertEntityToOption} from "../../lib/helpers";
import Select, {MultiValue, SingleValue} from "react-select";
import {texts} from "../../consts";

interface IAsyncComboBoxProps {
    service: PartialService<NamedEntity>,
    isEditable: boolean,
    isMultiSelect: boolean,
    onItemSelected: (itemsId: number[] | number | undefined) => void,
}

const takeCount: number = 30;

const getNoResultMessage = () => texts.comboBoxNoResult;
const loadingOption = { value: 'loading', label: texts.loading, disabled: true };

export const AsyncComboBox : FC<IAsyncComboBoxProps> =
    observer(({service, isEditable, isMultiSelect, onItemSelected}) => {
    const [inputValue, setInputValue] = useState<any>(undefined);
    const [offset, setOffset] = useState(0);
    const [options, setOptions] = useState<{value: any, label: string}[]>([]);

    const store = service.store;
    const storedItems = store.items;

    // useEffect(() => {
    //     if (!service.isLoading && isEditable) {
    //         setOptions((prevState: Array<any>) => [...prevState, loadingOption]);
    //         service.load(offset, takeCount, inputValue).then(() => setOptions(service.store.items.map(convertEntityToOption)));
    //     }
    // }, [service, isEditable, store, offset, inputValue])

    useEffect(() => {
        setOptions(storedItems.map(convertEntityToOption));
    }, [storedItems])

    const onScrolledToBottom = () => {
        console.log("on scroll")
        if (!service.isLoading && storedItems.length < store.totalCount) {
            const newOffset = offset + takeCount;
            setOffset(newOffset);

            setOptions((prevState: Array<any>) => [...prevState, loadingOption]);
            service.load(newOffset, takeCount, inputValue)//.then(() => setOptions(service.store.items.map(convertEntityToOption)));
        }
    }

    const onKeyDown = (newValue: string) => {
        console.log("on key down: " + newValue)

        const newInputValue =  newValue === "" ? undefined : newValue;

        if (newInputValue === inputValue)
        {
            return;
        }

        console.log("load in key down: " + inputValue)

        store.clear();

        const newOffset = 0;
        setOffset(newOffset);

        setInputValue(newInputValue);

        setOptions((prevState: Array<any>) => [...prevState, loadingOption]);
        service.load(newOffset, takeCount, newInputValue)//.then(() => setOptions(service.store.items.map(convertEntityToOption)));
    }

    return (
        <Select isMulti={isMultiSelect}
                options={options}
                isClearable={true}
                isDisabled={!isEditable}
                isLoading={service.isLoading}
                noOptionsMessage={getNoResultMessage}
                onChange={(newValue) => onItemSelected(getIdOfNewValue(isMultiSelect, newValue))}
                onInputChange={(newValue) => onKeyDown(newValue)}
                onMenuScrollToBottom={() => onScrolledToBottom()} />
    )
})

function getIdOfNewValue(isMulti: boolean, newValue: SingleValue<any> | MultiValue<any> | null): number[] | number | undefined {
    if (!newValue) {
        return undefined;
    }

    if (isMulti) {
        const result = []

        for (let i = 0; i < newValue.length; i++) {
            result.push(newValue[i].value);
        }

        return result;
    }

    return newValue.value;
}