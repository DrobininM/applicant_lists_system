select t9.id,
t9."cityName",
t8.id,
t8."universityName",
t7.id,
t7."fieldOfStudyName",
t5.id,
t5."programName",
t2."studyModeId",
t2."competitionTypeId",
t3.id,
t3."startDate",
t3."endDate"
from "Application" t1 inner join "ApplicationInfo" t2 on t1."applicationInfoId" = t2.id
inner join "EnrollmentPeriod" t3 on t1."enrollmentPeriodId" = t3.id
inner join "UniversityProgram" t4 on t2."universityProgramId" = t4.id
inner join "EducationalProgram" t5 on t4."educationalProgramId" = t5.id
inner join "UniversityWithFieldOfStudy" t6 on t4."universityWithFieldOfStudyId" = t6.id
inner join "FieldOfStudy" t7 on t6."fieldOfStudyId" = t7.id
inner join "University" t8 on t6."universityId" = t8.id
inner join "City" t9 on t8."cityId" = t9.id