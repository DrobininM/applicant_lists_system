import pandas as pd
from parsing.helpers import get_temp_file_name, retrieve_page, try_to_remove_temp_file


def check_can_process_file(url: str) -> bool:
    full_temp_file_name = get_temp_file_name(".x")

    try:
        retrieve_page(url, full_temp_file_name)
        pd.read_excel(full_temp_file_name)

        return True
    except:
        try:
            pd.read_html(full_temp_file_name)

            return True
        except:
            return False
    finally:
        try_to_remove_temp_file(full_temp_file_name)
