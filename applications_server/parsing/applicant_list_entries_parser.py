from pandas import DataFrame
from api.dto.application_requirement_dto import ApplicationRequirementDTO
from parsing.base.application_row import ApplicationRow
from utils.applicant_list_consts import COMPETITIVE_POSITION, INSURANCE_NUMBER, AGREEMENT, PRIORITY, SUBMITTED_DIPLOMA,\
    HAS_SPECIAL_RIGHT, EXTRA_SCORE
from utils.helpers import get_first_element_index, is_value_float, get_first_element, get_insurance_number


def parse(df: DataFrame, requirements: list[ApplicationRequirementDTO])\
        -> list[ApplicationRow]:
    position_requirement = __get_position_requirement(requirements)
    position_range = position_requirement.range

    pivot_row_index = None
    pivot_col_index = None

    if position_range.end_column_index is None:
        pivot_row_index = position_range.start_row_index
        pivot_col_index = position_range.start_column_index
    else:
        for column_index in range(position_range.start_column_index, position_range.end_column_index):
            sliced = df.iloc[position_range.start_row_index:position_range.end_row_index + 1, column_index].tolist()
            possible_row_index = get_first_element_index(sliced, lambda x: str(x) == position_range.pivot_content)

            if possible_row_index is not None:
                pivot_row_index = possible_row_index
                pivot_col_index = column_index

                break

    if pivot_row_index is None:
        print("Couldn't find the row with header column names")
        raise Exception

    content_start_row_index = get_first_element_index(df.iloc[pivot_row_index:len(df), pivot_col_index].tolist(),
                                                      lambda x: is_value_float(x)) + pivot_row_index

    if content_start_row_index is None:
        print("Couldn't find the start of applicants data")
        raise Exception

    result = __parse(df, requirements, content_start_row_index)

    if len(result) == 0:
        raise ValueError("Couldn't read any rows")

    return result


def __parse(df: DataFrame, requirements: list[ApplicationRequirementDTO], content_start_row_index: int)\
        -> list[ApplicationRow]:
    subject_requirements = [requirement for requirement in requirements if requirement.is_subject]
    result_list = []

    for index, row in df.iloc[content_start_row_index:len(df)].iterrows():
        row_list = row.tolist()

        position_requirement = __get_position_requirement(requirements)
        position = __get_content_by_requirement(row_list, position_requirement)
        if position is None:
            continue

        position = int(str(position).replace(" ", ""))

        insurance_requirement = __get_requirement_by_name(requirements, INSURANCE_NUMBER)
        insurance_number = __get_content_by_requirement(row_list, insurance_requirement)
        if insurance_number is None:
            continue

        diploma_requirement = __get_requirement_by_name(requirements, SUBMITTED_DIPLOMA)
        diploma = __get_content_by_requirement(row_list, diploma_requirement)

        agreement_requirement = __get_requirement_by_name(requirements, AGREEMENT)
        agreement = __get_content_by_requirement(row_list, agreement_requirement)

        priority_requirement = __get_requirement_by_name(requirements, PRIORITY)
        priority = __get_content_by_requirement(row_list, priority_requirement)

        if agreement is None and priority is None:
            continue

        extra_score_requirement = __get_requirement_by_name(requirements, EXTRA_SCORE)
        extra_score = __get_content_by_requirement(row_list, extra_score_requirement)

        if extra_score is None:
            extra_score = 0

        special_right_requirement = __get_requirement_by_name(requirements, HAS_SPECIAL_RIGHT)
        special_right = __get_content_by_requirement(row_list, special_right_requirement)

        scores = [__get_content_by_requirement(row_list, subject_requirement)
                  for subject_requirement in subject_requirements]

        application_row =\
            ApplicationRow(position_in_list=position,
                           insurance_number=get_insurance_number(insurance_number),
                           admission_agreement=__get_true_or_false_for_requirement(agreement, agreement_requirement),
                           priority=priority,
                           submitted_diploma=__get_true_or_false_for_requirement(diploma, diploma_requirement),
                           subject_point_list=scores, extra_score=extra_score,
                           has_special_right=__get_true_or_false_for_requirement(special_right,
                                                                                 special_right_requirement))

        result_list.append(application_row)

    return result_list


def __get_position_requirement(requirements: list[ApplicationRequirementDTO]) -> ApplicationRequirementDTO | None:
    return __get_requirement_by_name(requirements, COMPETITIVE_POSITION)


def __get_requirement_by_name(requirements: list[ApplicationRequirementDTO], name: str)\
        -> ApplicationRequirementDTO | None:
    for requirement in requirements:
        if requirement.requirement_name == name:
            return requirement


def __get_content_by_requirement(row: list, requirement: ApplicationRequirementDTO):
    if requirement is None:
        return None

    req_range = requirement.range

    if req_range is None:
        return None

    if req_range.end_column_index is None:
        return get_first_element([row[req_range.start_column_index]], __can_get_content)

    return get_first_element(row[req_range.start_column_index:req_range.end_column_index + 1], __can_get_content)


def __can_get_content(value) -> bool:
    return value is not None and str(value) != "nan" and len(str(value)) != 0


def __get_true_or_false_for_requirement(value, requirement: ApplicationRequirementDTO | None):
    if value is None or requirement is None:
        return None

    return value in requirement.classification
