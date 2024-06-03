import config
import requests


def test_study_modes_created():
    result = requests.post(
        f'{config.API_URL}/study_modes'
    )

    assert result.status_code == 200
    assert len(result.json()["study_modes"]) > 0


def test_competition_types_created():
    result = requests.post(
        f'{config.API_URL}/competition_types'
    )

    assert result.status_code == 200
    assert len(result.json()["competition_types"]) > 0
