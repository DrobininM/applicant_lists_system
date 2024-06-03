from typing import Callable


def split_data_by_offset(data_list: list, offset: int, count: int, filter_func: (Callable[[any], bool]) | None = None)\
        -> (list, int):
    if offset >= len(data_list):
        return [], 0

    end_index = offset + count

    selected_data = data_list

    if filter_func is not None:
        selected_data = [item for item in selected_data if filter_func(item)]

    if end_index > len(selected_data):
        end_index = len(selected_data)

    result = selected_data[offset:end_index]

    return result, len(result)
