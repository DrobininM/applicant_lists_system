import TRow from "./tableRow";

export default function TableBody(props) {
    return (
        <tbody>
        {props.rows.map(row => <TRow rowIndex={row.id + 1}
                                     key={row.id}
                                     row={row.values} tableColor={props.tableColor}
                                     doHighlightAgreement={row.doHighlightAgreement}
                                     doHighlightDoc={row.doHighlightDoc}
                                     doHighlightManyAgreements={row.doHighlightManyAgreements}
                                     doHighlightGreaterSum={row.doHighlightGreaterSum}
                                     doHighlightLessSum={row.doHighlightLessSum}/>)}
        </tbody>
    )
}