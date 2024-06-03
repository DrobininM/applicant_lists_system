import pandas as pd

from api.models.admission_prediction_dto import AdmissionPredictionDTO
from data.neuro_model import position_mean, position_std, score_std, score_mean, priority_mean, priority_std, seats_std, \
    seats_mean, original_df, network_df, model


def evaluate_probability(dto: AdmissionPredictionDTO) -> float | None:
    if dto.city_name == "Москва":
        city_name = "Moscow"
    elif dto.city_name == "Пермь":
        city_name = "Perm"
    elif dto.city_name == "Нижний Новгород":
        city_name = "Nizhniy Novgorod"
    elif dto.city_name == "Санкт-Петербург":
        city_name = "Saint-Petersburg"
    else:
        city_name = dto.city_name

    result = __predict({
        'Position_in_list': dto.competitive_position,
        'Score_sum': dto.score_sum,
        'Priority': dto.priority,
        'Original_diploma': dto.submitted_diploma,
        'Priority_right': dto.has_priority_right,
        'Number_of_seats': dto.budget_seats,
        'City': city_name,
        'Field_of_study_code': dto.field_of_study_name[0:8],
    })

    if isinstance(result, float):
        return None

    result = result[0][0]

    if result < 0:
        return 0

    if result > 0.99:
        return 1

    return result


def __predict(values):
    code_list = __find_code(values['Field_of_study_code'], original_df, network_df)

    if code_list is None:
        return float('NaN')

    city_list = __find_city_code(values['City'], original_df, network_df)

    if city_list is None:
        return float('NaN')

    position = __standardize_value(values['Position_in_list'], position_mean, position_std)
    score = __standardize_value(values['Score_sum'], score_mean, score_std)
    priority = __standardize_value(values['Priority'], priority_mean, priority_std)
    original = 1 if values['Original_diploma'] else 0
    priority_right = 1 if values['Priority_right'] else 0
    seats = __standardize_value(values['Number_of_seats'], seats_mean, seats_std)

    df_to_predict = pd.DataFrame(columns=network_df.columns[1:len(network_df.columns)])
    df_to_predict.loc[0] = [position, score, priority, original, priority_right, seats, *city_list, *code_list]

    return model.predict(df_to_predict[:1], verbose=False)


def __find_code(code, df_with_fields, df_with_codes):
    result_df = df_with_fields.loc[df_with_fields['Field_of_study_code'] == code]['Field_of_study_code']

    if len(result_df) == 0:
        return None

    result_index = result_df.index.tolist()[0]

    return df_with_codes.loc[result_index].iloc[10:16].tolist()


def __find_city_code(city, df_with_cities, df_with_codes):
    result_df = df_with_cities.loc[df_with_cities['City'] == city]['City']

    if len(result_df) == 0:
        return None

    result_index = result_df.index.tolist()[0]

    return df_with_codes.loc[result_index].iloc[7:10].tolist()


def __standardize_value(value, mean, std):
    return (value - mean) / std
