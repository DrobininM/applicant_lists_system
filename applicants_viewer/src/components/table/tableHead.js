export default function TableHead(props) {
    const notLastStyle = {borderRight: "1px solid black", borderBottom: "1px solid black"};

    return (
        <thead>
            <tr>
                <td key={-1} style={notLastStyle}><b>№</b></td>
                {props.columns.map((col, i) =>
                    <td key={col.id}
                        style={i !== props.columns.length - 1 ? notLastStyle : {borderRight: "0px", borderBottom: "1px solid black"}}>
                        <b>{col.title}</b>
                    </td>)}
            </tr>
        </thead>
    )
}