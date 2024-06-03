from api.dto.application_requirement_dto import ApplicationRequirementDTO
from api.dto.selection_table_cell_dto import SelectionTableCellDTO
from api.dto.with_config import WithConfig


class ApplicationFileDTO(WithConfig):
    requirements: list[ApplicationRequirementDTO]
    selection_cells: list[SelectionTableCellDTO]
    row_count: int
    column_count: int
