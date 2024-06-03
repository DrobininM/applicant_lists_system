import urllib.request
import uuid
from pathlib import Path


def retrieve_page(url: str, file_name_with_ext: str):
    return urllib.request.urlretrieve(url, file_name_with_ext)


def get_temp_file_name(extension: str) -> str:
    temp_directory = __get_temp_directory()
    temp_file_name = temp_directory.joinpath(str(uuid.uuid4().int) + extension)

    return str(temp_file_name)


def try_to_remove_temp_file(file_name: str):
    try:
        temp_directory = __get_temp_directory()
        full_file_name = temp_directory.joinpath(file_name)

        Path.unlink(full_file_name)
    except:
        pass


def __get_temp_directory() -> Path:
    return Path(__file__).parents[1].joinpath("temp_files")
