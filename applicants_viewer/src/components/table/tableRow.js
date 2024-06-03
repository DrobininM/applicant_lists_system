import {useState} from "react";

export default function TRow(props) {
    const [hover, setHover] = useState(false);
    const onHover = () => {
        setHover(prevState => !prevState);
    }

    const styleWithTableColor = {backgroundColor: props.tableColor};
    const styleWithDarkerColor = {backgroundColor: "#f7f9ff"}

    const getCurRowBackground = () => {
        if (props.doHighlightManyAgreements) {
            return {backgroundColor: "#ff6264"}
        }

        if (props.doHighlightDoc) {
            return {backgroundColor: "#abffab"}
        }

        if (props.doHighlightAgreement) {
            return {backgroundColor: "#eaffab"}
        }

        if (props.doHighlightGreaterSum) {
            return {backgroundColor: "#bafff3"}
        }

        if (props.doHighlightLessSum) {
            return {backgroundColor: "#ffddbe"}
        }

        if (props.rowIndex % 2 === 0) {
            return styleWithTableColor;
        }

        return styleWithDarkerColor
    }

    return (
        <tr onMouseEnter={onHover} onMouseLeave={onHover}
            style={hover ? {backgroundColor: "#7ab1ff"} : getCurRowBackground()}>
            <td key={-1} style={{borderRight: "1px solid black", padding: 1}}>{props.rowIndex}</td>
            {props.row.map((rowEntry, i) =>
                <td key={rowEntry.id} style={i !== props.row.length - 1 ? {borderRight: "1px solid black", padding: 2} : {borderRight: "0px", padding: 2}}>
                    {rowEntry.value}
                </td>)}
        </tr>
    );
}