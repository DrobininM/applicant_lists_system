from urllib.request import Request, urlopen
from bs4 import BeautifulSoup
from parsing.base.application_row import ApplicationRow
from parsing.base.application_info import ApplicationInfo
from parsing.base.parser_base import Parser
from parsing.consts import BAD_RESULT
from utils import helpers
from utils.helpers import get_insurance_number


class PNIPUParser(Parser):
    bad_result = "bad"

    def parse(self):
        hdr = {'User-Agent': 'Mozilla/5.0'}
        req = Request(self._url, headers=hdr)
        page = urlopen(req)
        soup = BeautifulSoup(page, 'html.parser')

        #print(soup.body.findAll('tr'))

        tr_list = soup.body.findAll('tr')
        dt = tr_list[2].find("td").getText()
        dt = dt.replace("Дата формирования - ", "").replace(". Время формирования -", "")[:-1]
        date_time = utils.parse_date_string(dt)
        #print(date_time)

        sm = tr_list[3].find("td").getText()
        sm = sm.replace("Форма обучения - ", "")
        study_mode = consts.PART_TIME
        if 'Очная' in sm:
            study_mode = consts.FULL_TIME
        elif 'очно' in sm.lower():
            study_mode = consts.FULL_PART_TIME
        #print(study_mode)

        ep = tr_list[6].find("td").getText()
        educational_program = ep.replace("Направление подготовки/специальность - ", "")
        #print(educational_program)

        ct = tr_list[7].find("td").getText()
        competition_type = consts.TARGETED
        if 'Бюджетная' in ct:
            competition_type = consts.BUDGET
        elif 'Полное' in ct:
            competition_type = consts.COMMERCIAL

        #print(competition_type)

        sd = tr_list[9].find("td").getText()
        study_direction = sd.replace("Конкурсная группа - ", "").replace(" (Очно-Бюджет)", "").replace(" (Очно-Контракт)", "")\
            .replace(" (Очно-Контракт)", "").replace(" (Очно-ЦП)", "").replace(" (Очно-КОП)", "").strip()

        #print(study_direction)

        p = tr_list[10].find("td").getText()
        p = p.split(".")[0]
        places = p.replace("Всего мест: ", "")

        #print(places)

        subject_names = []
        td_list = tr_list[12].findAll("td")
        for i in range(4, len(td_list) - 7):
            subject_names.append(td_list[i].getText())

        #print(subject_names)

        applicant_list = []
        data_tr_list = tr_list[13:]
        for tr in data_tr_list:
            td_list = tr.findAll("td")
            position = td_list[0].getText()

            insurance_number = get_insurance_number(td_list[1].getText())
            if insurance_number == BAD_RESULT:
                continue

            special_right = td_list[2].getText() != ""

            score_list = self.__get_subject_scores(td_list)
            if score_list == BAD_RESULT:
                continue

            shifted_index = len(td_list) - 7

            extra_score = td_list[shifted_index].getText()

            orig_doc = td_list[shifted_index + 1].getText() == "Оригинал"

            agreement = td_list[shifted_index + 2].getText() != ""

            # noinspection PyBroadException
            try:
                applicant_list.append(
                    ApplicationRow(int(position), insurance_number, agreement, orig_doc,
                                   score_list, extra_score, special_right))
            except Exception:
                continue

        application_info = ApplicationInfo("ПНИПУ", study_direction, educational_program, 0, 0, 0, study_mode,
                                           competition_type, self._url, date_time, subject_names)

        if competition_type == consts.BUDGET:
            application_info.budget_seat_number = int(places)
        elif competition_type == consts.COMMERCIAL:
            application_info.commercial_seat_number = int(places)
        else:
            application_info.targeted_seat_number = int(places)

        return [application_info, applicant_list]

    def __get_subject_scores(self, all_td):
        scores = []
        for i in range(4, len(all_td) - 7):
            value = all_td[i].getText()

            # noinspection PyBroadException
            try:
                scores.append(int(value))
            except Exception:
                scores = BAD_RESULT

                break

        return scores
