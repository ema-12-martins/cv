import pandas as pd
import requests
import json
import os

# Define the relative path to dataset_final.csv
file_path = os.path.join(os.pardir, os.pardir, 'data', 'dataset_final_cleaned.csv')

# Load the CSV file using pandas (example usage)
df = pd.read_csv(file_path)




# Your API key from Last.fm
API_KEY = '2ac33963b8499ddf6e0bed574531152e'

# Base URL for Last.fm API
BASE_URL = 'http://ws.audioscrobbler.com/2.0/'


# Stats on last fm
album_name = []
id = 0


for index, row in df.iterrows():
    id += 1
    print(id)
    # Parameters for the API call to get track info
    params = {
        'method': 'track.getInfo',
        'api_key': API_KEY,
        'artist': row['artist'],
        'track': row['title'],
        'format': 'json'
    }
    # Make the API call
    response = requests.get(BASE_URL, params=params)

    try:
        track_info = response.json()
    except json.decoder.JSONDecodeError:
        album_name.append("")
        continue

    if 'error' in track_info:
        params = {
        'method': 'track.search',
        'api_key': API_KEY,
        'track': row['title'],
        'format': 'json'
        }
        # Make the API call
        response = requests.get(BASE_URL, params=params)

        try:
            track_info = response.json()
        except json.decoder.JSONDecodeError:
            continue
        if track_info['results']['opensearch:totalResults'] != '0':
            track_info = track_info['results']['trackmatches']['track'][0]
            #row['artist'] = track_info['artist']
            params = {
                'method': 'track.getInfo',
                'api_key': API_KEY,
                'artist': row['artist'],
                'track': track_info['name'],
                'format': 'json'
            }
            # Make the API call
            response = requests.get(BASE_URL, params=params)

            # Parse the JSON response
            try:
                track_info = response.json()
            except json.decoder.JSONDecodeError:
                album_name.append("")
                continue
        else:
            album_name.append("")
            continue

    #Parameters for the API call to get singer info
    params_singer = {
        'method': 'artist.getInfo',
        'api_key': API_KEY,
        'artist': row['artist'],
        'format': 'json'
    }

    # Make the API call
    response = requests.get(BASE_URL, params=params_singer)

    # Parse the JSON response and handle JSONDecodeError
    
    try:
        info_singer = response.json()
    except json.decoder.JSONDecodeError:
        album_name.append("")
        continue


    if 'error' in info_singer:
        #Parameters for the API call to get singer info
        params_singer = {
            'method': 'artist.search',
            'api_key': API_KEY,
            'artist': row['artist'],
            'format': 'json'
        }

        # Make the API call
        response = requests.get(BASE_URL, params=params_singer)

        try:
            info_singer = response.json()
        except json.decoder.JSONDecodeError:
            album_name.append("")
            continue

    #Parameter for the API call to get album info
    if 'album' in track_info['track']:
        params_album = {
            'method': 'album.getInfo',
            'api_key': API_KEY,
            'artist': row['artist'],
            'album': track_info['track']['album']['title'],
            'format': 'json'
        }
        # Make the API call
        response = requests.get(BASE_URL, params=params_album)

        try:
            info_album = response.json()
        except json.decoder.JSONDecodeError:
            album_name.append("")
            continue
        if 'error' in info_album:
            #Parameters for the API call to get singer info
            params_album = {
                'method': 'album.search',
                'api_key': API_KEY,
                'album': track_info['track']['album']['title'],
                'format': 'json'
            }

            # Make the API call
            response = requests.get(BASE_URL, params=params_album)

            try:
                info_album = response.json()
            except json.decoder.JSONDecodeError:
                album_name.append("")
                continue
            if info_album['results']['opensearch:totalResults'] != '0':
                info_album = info_album['results']['albummatches']['album'][0]
                params_album = {
                    'method': 'album.getInfo',
                    'api_key': API_KEY,
                    'artist': row['artist'],
                    'album': info_album['name'],
                    'format': 'json'
                }
                # Make the API call
                response = requests.get(BASE_URL, params=params_album)

                try:
                    info_album = response.json()
                except json.decoder.JSONDecodeError:
                    album_name.append("")
                    continue
            else:
                album_name.append("")
                continue

    
    if 'album' in track_info['track']:
        if not 'error' in info_album:
            album_name.append(info_album['album']['name'])
        else:
            album_name.append("")
    else:
        album_name.append("")

df['album'] = album_name

print(df.head())

# Save the dataset to a new CSV file
df.to_csv(os.path.join(os.pardir, os.pardir, 'data', 'dataset_final_cleaned_2.csv'), index=False)