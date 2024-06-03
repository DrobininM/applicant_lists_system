import {WITHOUT_EXAMS} from "../../consts/strings";
import {useContext} from "react";
import {GlobalSearchContext} from "../../App";

export default function OtherProgramLink(props) {
    const {setSelectedOtherProgram} = useContext(GlobalSearchContext);

    const onLinkClicked = (id) => {
        // let program = props.otherPrograms[id];
        // console.log("clicked", program)
        // setSelectedOtherProgram({universityId: program[0], directionId: program[2], programId: program[4],
        //     competitionId: program[6], competitionName: program[7], studyModeId: program[8]});
    }

    const prepareOtherProgram = (rawPrograms) => {
        return rawPrograms.map((rawProgram, i) => {
            if (rawProgram.length === 0) {
                return <div></div>
            }

            let text = "";
            if (i !== 0) {
                text += ", "
            }

            text += rawProgram[1] + ', "' + rawProgram[3] + " - " + rawProgram[5] + '" ';

            if (rawProgram[7].includes(WITHOUT_EXAMS)) {
                text += "[" + WITHOUT_EXAMS + "]";
            } else {
                text += "[" + rawProgram[7][0] + "]";
            }

            if (rawProgram[9].includes("-")) {
                text += " [ОЧ-З]"
            } else if (rawProgram[9].toLowerCase().includes("за")) {
                text += " [З]"
            } else {
                text += " [ОЧ]"
            }

            text += " {" + rawProgram[10] + "/" + rawProgram[12] + "}"

            if (rawProgram[11] === "True") {
                text += " [СОГЛ]"
            } else {
                text += " [НЕ СОГЛ]"
            }

            return <a href="#" id={i} onClick={(e) => onLinkClicked(e.currentTarget.id)} style={{fontSize: "14px"}}>{text}</a>
        })
    }

    return (
        <div>{prepareOtherProgram(props.otherPrograms)}</div>
    )
}