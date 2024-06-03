from pathlib import Path

import keras
import pandas as pd
import category_encoders as ce


def __standardize(df, column_name):
    df[column_name] = (df[column_name] - df[column_name].mean()) / df[column_name].std()


model = keras.models.load_model(str(Path(__file__).parent / "model.keras"))

original_df = pd.read_excel(str(Path(__file__).parent / "hse.xlsx"))
original_df.drop('Rating_of_university', axis=1, inplace=True)
original_df.drop(original_df[original_df["Priority"].isna()].index, inplace=True)
original_df.drop(original_df[original_df['Passed'] & ~original_df['Original_diploma']].index, inplace=True)

new_df = original_df.drop(["Program_name", "Field_of_study_name"], axis=1)

__standardize(new_df, 'Position_in_list')
__standardize(new_df, 'Score_sum')
__standardize(new_df, 'Priority')
__standardize(new_df, 'Number_of_seats')

new_df.replace(True, 1, inplace=True)
new_df.replace(False, 0, inplace=True)

network_df = new_df.drop(['ID'], axis=1)

encoder = ce.BinaryEncoder(cols=['City', 'Field_of_study_code'], return_df=True)
network_df = encoder.fit_transform(network_df)

position_mean = original_df['Position_in_list'].mean()
position_std = original_df['Position_in_list'].std()

score_mean = original_df['Score_sum'].mean()
score_std = original_df['Score_sum'].std()

priority_mean = original_df['Priority'].mean()
priority_std = original_df['Priority'].std()

seats_mean = original_df['Number_of_seats'].mean()
seats_std = original_df['Number_of_seats'].std()
