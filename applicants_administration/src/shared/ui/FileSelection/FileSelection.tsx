import {FC, useState} from "react";
import styles from './styles.module.css'
import {texts} from '../../consts'

interface IFileSelectionProps {
    onFileChosen: (file: File | undefined) => void;
    extensionList: string[];
}

export const FileSelection: FC<IFileSelectionProps> = ({onFileChosen, extensionList}) => {
    const [selectedFileName, setSelectedFileName] = useState("");

    const onInputFile = (files: FileList | null) => {
        if (!files || files.length === 0 || !getIsFileNameCorrect(files[0].name, extensionList)) {
            setSelectedFileName("");
            onFileChosen(undefined);

            return;
        }

        const file = files[0];

        onFileChosen(file);
        setSelectedFileName(file.name);
    }

    return (
        <div>
            <label htmlFor={"inputFile"} className={styles.inputFile}>
                <input type="file" accept={getAcceptList(extensionList)} name="file" id="inputFile" onChange={(e) => onInputFile(e.target.files)} />
                <span className={styles.inputFileBtn}>{texts.chooseFile}</span>
                <span className={styles.inputFileText}>{selectedFileName}</span>
            </label>
        </div>
    )
}

const getAcceptList = (extensionList: string[]) => {
    return extensionList.reduce((result, current, i) => {
        if (i !== 0) {
            return result + ", " + current;
        } else {
            return current;
        }
    })
}

const getIsFileNameCorrect = (fileName: string, extensionList: string[]) => {
    const indexOfLastDot = fileName.lastIndexOf(".");
    const fileExtension = fileName.slice(indexOfLastDot);

    return extensionList.includes(fileExtension);
}