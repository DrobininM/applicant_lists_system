import "./styles.css"
import {Col, Row, Form, Button} from "react-bootstrap";
import Accordion from "react-bootstrap/Accordion";
import {useContext, useState} from "react";
import {ApplicationContext} from "../../App";
import validatePositiveNumbers from "../../utils/validation";

export default function Highlighting(props) {
    const {setDoHighlightAgreement, setDoHighlightDoc, setDoHighlightManyAgreements,
        setDoHighlightGreaterSum, setDoHighlightLessSum} = useContext(ApplicationContext)

    const textStyle = {color: "black", fontSize: "14px"};

    const [isAgreementChecked, setIsAgreementChecked] = useState(false);
    const [isDocumentChecked, setIsDocumentChecked] = useState(false);
    const [isManyAgreementsChecked, setManyAgreementsChecked] = useState(false);

    const [sumGreaterText, setGreaterText] = useState('');
    const [sumLessText, setLessText] = useState('');

    const clearBoxes = () => {
        setIsAgreementChecked(false)
        setDoHighlightAgreement(false)
        setIsDocumentChecked(false)
        setDoHighlightDoc(false)
        setManyAgreementsChecked(false)
        setDoHighlightManyAgreements(false)

        setGreaterText('')
        setDoHighlightGreaterSum(Number.MAX_SAFE_INTEGER)
        setLessText('')
        setDoHighlightLessSum(Number.MIN_SAFE_INTEGER)
    }

    return (
        <Accordion.Item eventKey={props.eventKey}>
            <Accordion.Header>Выделение</Accordion.Header>
            <Accordion.Body>
                {/*<Row className="align-items-center">*/}
                {/*    <Col>*/}
                {/*        <span style={textStyle}>Есть согласие на зачисление</span>*/}
                {/*    </Col>*/}
                {/*    <Col xs={3}>*/}
                {/*        <input className="form-check-input mx-2" type="checkbox" checked={isAgreementChecked} onChange={e => {*/}
                {/*            setDoHighlightAgreement(e.target.checked)*/}
                {/*            setIsAgreementChecked(e.target.checked)*/}
                {/*        }} id="flexCheckDefault"/>*/}
                {/*    </Col>*/}
                {/*</Row>*/}
                <Row className="align-items-center mt-1">
                    <Col>
                        <span style={textStyle}>Принёс оригинал документа</span>
                    </Col>
                    <Col xs={3}>
                        <input className="form-check-input mx-2" type="checkbox" checked={isDocumentChecked} onChange={e => {
                            setDoHighlightDoc(e.target.checked)
                            setIsDocumentChecked(e.target.checked)
                        }} id="flexCheckDefault"/>
                    </Col>
                </Row>
                {/*<Row className="align-items-center mt-1">*/}
                {/*    <Col>*/}
                {/*        <span style={textStyle}>Несколько согласий на зачисление</span>*/}
                {/*    </Col>*/}
                {/*    <Col xs={3}>*/}
                {/*        <input className="form-check-input mx-2" type="checkbox" checked={isManyAgreementsChecked} onChange={e => {*/}
                {/*            setDoHighlightManyAgreements(e.target.checked)*/}
                {/*            setManyAgreementsChecked(e.target.checked)*/}
                {/*        }} id="flexCheckDefault"/>*/}
                {/*    </Col>*/}
                {/*</Row>*/}
                <Row className="align-items-center mt-1">
                    <Col>
                        <span style={textStyle}>Сумма баллов больше</span>
                    </Col>
                    <Col xs={5} className="ms-1">
                        <Form.Control placeholder="0" value={sumGreaterText} onChange={e => {
                            if (validatePositiveNumbers(e.target.value)) {
                                setGreaterText(e.target.value);

                                if (e.target.value === "") {
                                    setDoHighlightGreaterSum(Number.MAX_SAFE_INTEGER)
                                } else {
                                    setDoHighlightGreaterSum(e.target.value);
                                }
                            }
                        }}/>
                    </Col>
                </Row>
                <Row className="align-items-center mt-1">
                    <Col>
                        <span style={textStyle}>Сумма баллов меньше</span>
                    </Col>
                    <Col xs={5} className="ms-1">
                        <Form.Control placeholder="0" value={sumLessText} onChange={e => {
                            if (validatePositiveNumbers(e.target.value)) {
                                setLessText(e.target.value);

                                if (e.target.value === "") {
                                    setDoHighlightLessSum(Number.MIN_SAFE_INTEGER)
                                } else {
                                    setDoHighlightLessSum(e.target.value);
                                }
                            }
                        }}/>
                    </Col>
                </Row>
                <div className="d-flex justify-content-center mt-3">
                    <Button className="btn-light" onClick={clearBoxes} >Сбросить всё</Button>
                </div>
            </Accordion.Body>
        </Accordion.Item>
    )
}