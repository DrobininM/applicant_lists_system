import dataclasses
from datetime import datetime
import random
import re
from typing import Callable

from parsing.consts import BAD_RESULT


def get_random():
    return random.getrandbits(31)


def parse_date_string(date_string):
    # noinspection PyBroadException
    try:
        result = datetime.strptime(date_string, '%d.%m.%Y %H:%M:%S')
    except Exception:
        result = datetime.strptime(date_string, '%m/%d/%Y %H:%M:%S %p')

    return result


def get_insurance_number(string):
    result = string

    if not re.match(r'\d{3}-\d{3}-\d{3}\s\d{2}', string):
        if len(string) == 11:
            result = string[:3] + "-" + string[3:6] + "-" + string[6:9] + " " + string[9:11]

    return result


def get_first_element_index(elements: list, condition: Callable):
    return next(i for i, x in enumerate(elements) if condition(x))


def get_first_element(elements: list, condition: Callable):
    return next((x for x in elements if condition(x)), None)


def is_value_float(value) -> bool:
    try:
        float(value)

        return True
    except ValueError:
        return False
