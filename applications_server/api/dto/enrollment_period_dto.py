import datetime
from api.dto.with_config import WithConfig


class EnrollmentPeriodDTO(WithConfig):
    period_id: int
    period_start_date: datetime.datetime
    period_end_date: datetime.datetime | None = None


class EnrollmentPeriodCreationDTO(WithConfig):
    period_start_date: datetime.datetime
    period_end_date: datetime.datetime | None = None
