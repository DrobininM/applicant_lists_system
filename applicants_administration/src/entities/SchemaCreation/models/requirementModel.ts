import {SelectionRange} from "./selectionRange";
import {action, makeObservable, observable} from "mobx";
import {NamedEntity} from "../../../shared/models/entity";

export class RequirementModel extends NamedEntity {
    public isAvailable: boolean = true;
    public isPending: boolean = false;
    public selectionRange: SelectionRange | undefined;
    public readonly isSubject: boolean;
    public readonly relatedRequirementId: number | undefined;
    public readonly isClassificationRequired: boolean;
    public classification: string | undefined;

    constructor(id: number, displayName: string, isSubject: boolean = false, relatedRequirementId: number | undefined = undefined,
                isClassificationRequired: boolean = false, classification: string | undefined = undefined,
                selectionRange: SelectionRange | undefined = undefined) {
        super(id, displayName, displayName)

        this.isSubject = isSubject;
        this.relatedRequirementId = relatedRequirementId;
        this.isClassificationRequired = isClassificationRequired;
        this.classification = classification;
        this.selectionRange = selectionRange;

        makeObservable(this, {
            isAvailable: observable,
            isPending: observable,
            displayName: observable,
            selectionRange: observable,
            classification: observable,
            setIsAvailable: action,
        })
    }

    public setIsAvailable(value: boolean) {
        this.isAvailable = value;
    }
}