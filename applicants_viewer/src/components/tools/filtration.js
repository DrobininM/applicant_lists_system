import {Button, Col, Form, Row} from "react-bootstrap";
import Accordion from "react-bootstrap/Accordion";
import {useContext, useState} from "react";
import {ApplicationContext} from "../../App";
import validatePositiveNumbers from "../../utils/validation";

export default function Filtration(props) {
    const {setDoHideEmptyOp, setDoHideGreaterSum, setDoHideLessSum} = useContext(ApplicationContext)

    const [isHideEmptyChecked, setIsHideEmptyChecked] = useState(false);

    const [sumGreaterText, setGreaterText] = useState('');
    const [sumLessText, setLessText] = useState('');

    const textStyle = {color: "black", fontSize: "14px"};

    const clearBoxes = () => {
        setIsHideEmptyChecked(false)
        setDoHideEmptyOp(false)

        setGreaterText('')
        setDoHideGreaterSum(Number.MAX_SAFE_INTEGER)
        setLessText('')
        setDoHideLessSum(Number.MIN_SAFE_INTEGER)
    }

    return (
        <Accordion.Item eventKey={props.eventKey}>
            <Accordion.Header>Фильтрация</Accordion.Header>
            <Accordion.Body>
                {/*<Row className="align-items-center">*/}
                {/*    <Col>*/}
                {/*        <span style={textStyle}>Скрыть, если нет других ОП</span>*/}
                {/*    </Col>*/}
                {/*    <Col xs={3}>*/}
                {/*        <input className="form-check-input mx-2" checked={isHideEmptyChecked} onChange={(e) => {*/}
                {/*            setDoHideEmptyOp(e.target.checked)*/}
                {/*            setIsHideEmptyChecked(e.target.checked)*/}
                {/*        }}*/}
                {/*               type="checkbox" value="" id="flexCheckDefault"/>*/}
                {/*    </Col>*/}
                {/*</Row>*/}
                <Row className="align-items-center mt-1">
                    <Col>
                        <span style={textStyle}>Скрыть, если сумма баллов больше</span>
                    </Col>
                    <Col xs={5} className="ms-1">
                        <Form.Control placeholder="0" value={sumGreaterText} onChange={(e) => {
                            if (validatePositiveNumbers(e.target.value)) {
                                setGreaterText(e.target.value)

                                if (e.target.value === "") {
                                    setDoHideGreaterSum(Number.MAX_SAFE_INTEGER)
                                } else {
                                    setDoHideGreaterSum(e.target.value);
                                }
                            }
                        }}/>
                    </Col>
                </Row>
                <Row className="align-items-center mt-1">
                    <Col>
                        <span style={textStyle}>Скрыть, если сумма баллов меньше</span>
                    </Col>
                    <Col xs={5} className="ms-1">
                        <Form.Control placeholder="0" value={sumLessText} onChange={(e) => {
                            if (validatePositiveNumbers(e.target.value)) {
                                setLessText(e.target.value)

                                if (e.target.value === "") {
                                    setDoHideLessSum(Number.MIN_SAFE_INTEGER)
                                } else {
                                    setDoHideLessSum(e.target.value);
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