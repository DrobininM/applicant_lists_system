import Highlighting from "./highlighting";
import Filtration from "./filtration";
import {Accordion, Button} from "react-bootstrap";
import {tableToExcel} from "../../utils/excelExport";

export default function Tools() {
    const createAndSendExcelFile = () => {
        //params: element id, sheet name, file name
        tableToExcel('tableRes','List', 'Applicants.xls')
    }

    return (
        <div style={{background: "white", borderRadius: "10px"}}>
            <Accordion alwaysOpen>
                <Highlighting eventKey={0}/>
                <Filtration eventKey={1}/>
            </Accordion>
            <div className="d-flex flex-column justify-content-center mx-lg-4 my-lg-2">
                <Button className="btn-success mb-lg-3 mt-lg-2" onClick={createAndSendExcelFile}>Экспорт в EXCEL</Button>
            </div>
        </div>
    )
}