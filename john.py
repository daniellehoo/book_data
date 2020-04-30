import pandas as pd
import json

# df = data frame
# column = values (i.e. names or titles--header row)
# bracket => look inside of table
# list => list of what columns we want
# back slash = special character in regex (escape character)
# pd series = data frame with 1 column

df = pd.read_json('nyTimesData.json')

# print(df.head())
# print(df.columns)
# print(df[['author', 'title', 'description']])

df  = df[['author', 'title', 'description']].drop_duplicates(keep='first')
# df['description'] == df.loc[:,'description']

# print(df.loc[:, 'title'].values) # .values gets representation of the Series/Data. It is usually a numpy array, which is just a more performant python array

print(' '.join(df['title'].values))

print(df['title'].head(10))
cleaned_df = df['title'].replace(regex=True, to_replace=r'[^a-zA-Z0-9\'\s\-/\\#]', value='')

words_series = pd.Series((' '.join(cleaned_df.values)).split())
uses_per_word = words_series.value_counts()
# with open('word_counts.json', 'w') as f:
#     json.dump(uses_per_word.to_dict(), f)  # https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.Series.to_dict.html

expanded = uses_per_word.reset_index()
expanded.columns = ['count', 'word']
expanded.to_json('d3_ready.json', orient='records')  # https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.to_dict.html
