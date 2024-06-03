import {InputGroup, Form} from "react-bootstrap";
import Select from "react-select";
import {useContext} from "react";
import {SearchContext} from "../table/tableWithInfoAndSearch";

export const searchOptions = [{value: "insuranceNumber", label: "СНИЛС"}, {
    value: "position",
    label: "Конкурсное место"
},
    {value: "sum", label: "Сумма баллов"}/*, {value: "otherPrograms", label: "Другие ОП"}*/];

export default function Search() {
    const {setSearchText, setSearchOptionId} = useContext(SearchContext)

    return (
        <div style={{maxWidth: "400px", display: "flex", justifyContent: "center"}}>
            <InputGroup>
                <Form.Control placeholder="Поиск" onChange={(e) => {
                    setSearchText(e.target.value);
                }}/>

                <Select align="end"
                        defaultValue={searchOptions[0]}
                        isSearchable={false}
                        options={searchOptions}
                        onChange={(selected) => {
                            setSearchOptionId(selected.value)
                        }}
                >
                </Select>
            </InputGroup>
        </div>
    )
}