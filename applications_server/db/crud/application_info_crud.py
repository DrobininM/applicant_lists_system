from db.models.application_info import ApplicationInfo
from db.crud.crud_base import CrudBase
from sqlalchemy import select, and_
from db.models.competition_type import CompetitionType
from db.models.study_mode import StudyMode
from db.models.university_program import UniversityProgram
from db.models.university_with_field_of_study import UniversityWithFieldOfStudy


class ApplicationInfoCrud(CrudBase):
    def create_application_info(self, university_program_id: int, study_mode_id: int, competition_type_id: int)\
            -> ApplicationInfo:
        new_application_info = ApplicationInfo(universityProgramId=university_program_id,
                                               studyModeId=study_mode_id, competitionTypeId=competition_type_id)
        self._add_to_db(new_application_info)

        return new_application_info

    def create_if_not_exist(self, university_program_id: int, study_mode_id: int, competition_type_id: int)\
            -> ApplicationInfo:
        possible_entry = self.get_application_info(university_program_id, study_mode_id, competition_type_id)

        if possible_entry is None:
            return self.create_application_info(university_program_id, study_mode_id, competition_type_id)

        return possible_entry

    def get_application_info(self, university_program_id: int, study_mode_id: int, competition_type_id: int)\
            -> ApplicationInfo | None:
        query = select(ApplicationInfo)\
            .where(and_(ApplicationInfo.universityProgramId == university_program_id,
                        ApplicationInfo.studyModeId == study_mode_id,
                        ApplicationInfo.competitionTypeId == competition_type_id))\

        query_row = self._select_one_by_query(query)

        if query_row is not None:
            return query_row[0]

    def get_application_info_by_id(self, application_info_id: int) -> ApplicationInfo | None:
        query = select(ApplicationInfo).where(ApplicationInfo.id == application_info_id)

        query_row = self._select_one_by_query(query)

        if query_row is not None:
            return query_row[0]

    def get_program_study_modes(self, university_id: int, field_of_study_id: int, program_id: int)\
            -> list[StudyMode] | None:
        query = select(StudyMode).select_from(ApplicationInfo) \
            .join(StudyMode)\
            .join(UniversityProgram)\
            .join(UniversityWithFieldOfStudy)\
            .where(and_(UniversityWithFieldOfStudy.universityId == university_id,
                        UniversityWithFieldOfStudy.fieldOfStudyId == field_of_study_id,
                        UniversityProgram.educationalProgramId == program_id))\
            .distinct()

        query_row = self._db_session.execute(query)
        rows = query_row.fetchall()

        if rows is None:
            return None

        return [row[0] for row in rows]

    def get_program_competition_types(self, university_id: int, field_of_study_id: int, program_id: int,
                                      study_mode_id: int) -> list[CompetitionType] | None:
        query = select(CompetitionType).select_from(ApplicationInfo)\
            .join(CompetitionType)\
            .join(UniversityProgram)\
            .join(UniversityWithFieldOfStudy)\
            .where(and_(ApplicationInfo.studyModeId == study_mode_id,
                        UniversityWithFieldOfStudy.universityId == university_id,
                        UniversityWithFieldOfStudy.fieldOfStudyId == field_of_study_id,
                        UniversityProgram.educationalProgramId == program_id))

        query_row = self._db_session.execute(query)
        rows = query_row.fetchall()

        if rows is None:
            return None

        return [row[0] for row in rows]
