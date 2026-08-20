import json
from pymongo import MongoClient

client = {
    "calendar_api": {
        "users": {
            "username": "admin",
            "password": "admin"
        },
        "events": {
            "title": "Sample Event",
            "date": "2024-12-31",
        }
    }
}
db = client["calendar_api"]

users = db["users"]
events = db["events"]

users.delete_many({})
events.delete_many({})

with open("data/users.json") as f:
    users_data = json.load(f)
    users.insert_many(users_data)

with open("data/events.json") as f:
    events_data = json.load(f)
    events.insert_many(events_data)

print("Populated!")
