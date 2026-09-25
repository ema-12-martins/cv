import pandas as pd
import os

# Define the relative path to dataset_final.csv
file_path = os.path.join(os.pardir, os.pardir, 'data', 'dataset_final_cleaned.csv')

# Load the CSV file using pandas (example usage)
df = pd.read_csv(file_path)

# Not using language column, so drop it
df = df.drop(columns=['language'])

# Save the cleaned dataset to a new CSV file
df.to_csv(os.path.join(os.pardir, os.pardir, 'data', 'dataset_final_cleaned.csv'), index=False)