import {SelectionRangeDTO} from "./selectionRangeDTO";

export class RequirementDTO {
    requirement_id: number;
    requirement_name: string;
    range: SelectionRangeDTO | undefined;
    is_subject: boolean;
    substitution_requirement_id: number | undefined;
    is_classification_required: boolean;
    classification: string | undefined;

    constructor(requirementId: number, requirementName: string, range: SelectionRangeDTO | undefined, isSubject: boolean,
                substitutionRequirementId: number | undefined, isClassificationRequired: boolean, classification: string | undefined) {
        this.requirement_id = requirementId;
        this.requirement_name = requirementName;
        this.range = range;
        this.is_subject = isSubject;
        this.substitution_requirement_id = substitutionRequirementId;
        this.is_classification_required = isClassificationRequired;
        this.classification = classification;
    }
}