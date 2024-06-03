from parsing.base.parser_base import Parser
import pandas as pd
import uuid
import os
from parsing.base.application_info import ApplicationInfo
from parsing.base.application_row import ApplicationRow
from parsing.consts import BAD_RESULT
from utils import helpers
from utils.helpers import get_insurance_number


class HseParser(Parser):
    def parse(self):
        temp_file_name = "temp_files\\" + str(uuid.uuid4().int) + ".xlsx"

        self._retrieve_page(temp_file_name)
        df = pd.read_excel(temp_file_name, sheet_name='TDSheet', skiprows=4)
        os.remove(temp_file_name)

        ep = df.iloc[0, 2]
        educational_program = ep.replace('"', '').replace('Образовательная программа ', '')

        sd = df.iloc[1, 2]
        study_direction = sd.replace('Направление ', '')

        sm = df.iloc[2, 2]
        study_mode = consts.PART_TIME
        if 'Очная' in sm:
            study_mode = consts.FULL_TIME
        elif 'очно' in sm.lower():
            study_mode = consts.FULL_PART_TIME

        ct = df.iloc[3, 2]
        competition_type = consts.TARGETED
        if 'бюджетное' in ct:
            competition_type = consts.BUDGET
        elif 'по договору' in ct:
            competition_type = consts.COMMERCIAL

        dt = df.iloc[6, 2]
        dt = dt.replace('Время формирования: ', '')
        date_time = utils.parse_date_string(dt)

        subject_names = self.__get_subject_names(df)

        applicant_list = []
        for i in range(7, df.shape[0]):
            insurance_number = get_insurance_number(str(df.iloc[i, 2]))
            if insurance_number == BAD_RESULT:
                continue

            agreement = self.__convert_yes_no_to_bool(df.iloc[i, 4])
            if agreement == BAD_RESULT:
                continue

            brought_original = self.__convert_yes_no_to_bool(df.iloc[i, 6])
            if brought_original == BAD_RESULT:
                continue

            subject_scores = self.__get_subject_scores(df, i)
            if subject_scores == BAD_RESULT:
                continue

            index_after_subjects = df.shape[1] - 5

            es = df.iloc[i, index_after_subjects]
            # noinspection PyBroadException
            try:
                extra_score = int(es)
            except Exception:
                extra_score = 0

            special_right = self.__convert_yes_no_to_bool(df.iloc[i, index_after_subjects + 4])
            if special_right == BAD_RESULT:
                continue

            # noinspection PyBroadException
            try:
                applicant_list.append(
                    ApplicationRow(int(df.iloc[i, 0]), insurance_number, agreement, brought_original,
                                   subject_scores, extra_score, special_right))
            except Exception:
                continue

        application_info = ApplicationInfo("НИУ ВШЭ", study_direction, educational_program, 4, 5, 6, study_mode,
                                           competition_type, self._url, date_time, subject_names)

        return [application_info, applicant_list]

    def __convert_yes_no_to_bool(self, string):
        result = BAD_RESULT

        if string == "Да":
            result = True

        if string == "Нет":
            result = False

        return result

    def __get_subject_names(self, data_frame):
        subject_names = []
        for j in range(8, data_frame.shape[1] - 8, 2):
            subject_names.append(data_frame.iloc[10, j])

        return subject_names

    def __get_subject_scores(self, data_frame, row_index):
        subject_scores = []
        for j in range(8, data_frame.shape[1] - 8, 2):
            value = data_frame.iloc[row_index, j]

            # noinspection PyBroadException
            try:
                subject_scores.append(int(value))
            except Exception:
                subject_scores = BAD_RESULT

                break

        return subject_scores
