import pandas as pd
import os

# Define the relative path to dataset_final.csv
file_path = os.path.join(os.pardir, os.pardir, 'data', 'dataset_final_cleaned.csv')

# Load the CSV file using pandas (example usage)
df = pd.read_csv(file_path)




# Not using language_cld3 and language column, so drop them
df = df.drop(columns=['language_ft', 'language','year','id'])

# Need to specify the information that came from last.fm API
# So rename the columns
df = df.rename(columns={'different_listeners': 'lastfm_different_listeners', 'playcount': 'lastfm_playcount', 'tags': 'lastfm_tags', 'content_song': 'lastfm_content_song', 'content_artist': 'lastfm_content_artist', 'image_artist': 'lastfm_image_artist', 'image_album': 'lastfm_image_album'})

# Count NaNs in each column
nan_count_per_column = df.isna().sum()


# Get the row where title is NaN
row_with_nan_title = df[df['title'].isna()]

# Based on lycris, we know that the tiltle of the song is '=' 
df.loc[row_with_nan_title.index, 'title'] = '='

# At lastfm_tags, where it isn't NaN, replace with the substring from beggining till last comma
df['lastfm_tags'] = df['lastfm_tags'].str.split(',').str[:-1].str.join(',')

# Rename language_cd3 to language, as it doesn't interfere the model that was used to get the language
df = df.rename(columns={'language_cld3': 'language'})

# Delete rows where lastfm_different_listeners is NaN, as it represents a failed integration to the last.fm API
df = df.dropna(subset=['lastfm_different_listeners'])

print(df.dtypes)

#Remove all " from the features column
df['features'] = df['features'].str.replace('"', '')
print(df['features'].head())

# Save the cleaned dataset to a new CSV file
df.to_csv(os.path.join(os.pardir, os.pardir, 'data', 'dataset_final_cleaned_2.csv'), index=False)
