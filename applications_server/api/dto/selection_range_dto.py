from api.dto.with_config import WithConfig


class SelectionRangeDTO(WithConfig):
    start_row_index: int
    start_column_index: int
    pivot_content: str
    end_row_index: int | None = None
    end_column_index: int | None = None

    def to_dict(self):
        return {
            "start_row_index": self.start_row_index,
            "start_column_index": self.start_column_index,
            "pivot_content": self.pivot_content,
            "end_row_index": self.end_row_index,
            "end_column_index": self.end_column_index,
        }


def range_dto_from_dict(ranges_dict: dict) -> SelectionRangeDTO:
    return SelectionRangeDTO(start_row_index=ranges_dict.get("start_row_index"),
                             start_column_index=ranges_dict.get("start_column_index"),
                             pivot_content=ranges_dict.get("pivot_content"),
                             end_row_index=ranges_dict.get("end_row_index"),
                             end_column_index=ranges_dict.get("end_column_index"))
