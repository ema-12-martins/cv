import pandas as pd
import os

# Define the relative path to dataset_final.csv
file_path = os.path.join(os.pardir, os.pardir, 'data', 'dataset_final_cleaned.csv')

# Load the CSV file using pandas (example usage)
df = pd.read_csv(file_path)

# Print all lycris columns with word "mim" on it
new_data = df[df['lyrics'].str.contains('tempo')]
print(new_data.count())
for index, row in new_data.iterrows():
    print(row['lyrics'])
    print('---------------------------')
    # Write to a file txt
    with open('tempo_lyrics.txt', 'a') as f:
        f.write(row['lyrics'])
        f.write('\n---------------------------\n')


