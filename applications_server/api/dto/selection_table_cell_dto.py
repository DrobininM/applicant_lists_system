from api.dto.with_config import WithConfig


class SelectionTableCellDTO(WithConfig):
    cell_content: str
    requirement_id: int | None = None

    def __init__(self, **data):
        super().__init__(**data)

    def to_dict(self):
        return {
            "cell_content": self.cell_content,
            "requirement_id": self.requirement_id,
        }


def cell_dto_from_dict(cells_dict: dict) -> SelectionTableCellDTO | None:
    return SelectionTableCellDTO(cell_content=cells_dict.get("cell_content"),
                                 requirement_id=cells_dict.get("requirement_id"))
