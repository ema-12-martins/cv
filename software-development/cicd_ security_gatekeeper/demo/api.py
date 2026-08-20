from flask import Flask, request, jsonify
from pymongo import MongoClient
from flask_cors import CORS
from bson.objectid import ObjectId
import os

app = Flask(__name__)
#CORS(app, origins="*")

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


# -----------------------------
#  USERS CRUD

@app.route("/users", methods=["GET"])
def get_users():
    result = []
    for u in users.find():
        u["_id"] = str(u["_id"])
        result.append(u)
    print("Users:", result)
    return jsonify(result)


@app.route("/users", methods=["POST"])
def create_user():
    data = request.json
    new_user = {
        "username": data["username"],
        "password": data["password"] 
    }
    
    users.insert_one(new_user)
    print("New user:", new_user)

    return jsonify({"message": "User created"}), 201

@app.route("/users/username/<username>", methods=["GET"])
def get_user_by_username(username):
    user = users.find_one({"username": username})
    if user:
        user["_id"] = str(user["_id"])
        print("User:", user["_id"])
        return jsonify(user)
    else:
        return jsonify({"success": False, "message": "User not found"}), 404


@app.route("/users/<id>", methods=["DELETE"])
def delete_user(id):
    users.delete_one({"_id": ObjectId(id)})
    return jsonify({"message": "User deleted"})


#  EVENTS CRUD

@app.route("/events", methods=["GET"])
def get_events():
    result = []
    for e in events.find():
        e["_id"] = str(e["_id"])
        result.append(e)
    print("Events:", result)
    return jsonify(result)


@app.route("/events", methods=["POST"])
def create_event():
    data = request.json
    new_event = {
        "user_id": data["user_id"],
        "title": data["title"],
        "date": data["date"],
        "description": data["description"]
    }
    events.insert_one(new_event)
    print("New event:", new_event)
    return jsonify({"message": "Event created"}), 201

@app.route("/events/user/<user_id>", methods=["GET"])
def get_events_by_user(user_id):
    user_id = int(user_id)  
    result = []
    for e in events.find({"user_id": user_id}):
        e["_id"] = str(e["_id"])
        result.append(e)

    print("Events:", result)
    return jsonify(result)

@app.route("/events/<id>", methods=["PUT"])
def update_event(id):
    data = request.json
    events.update_one(
        {"_id": ObjectId(id)},
        {"$set": {
            "title": data["title"],
            "date": data["date"],
            "description": data["description"]
        }}
    )
    return jsonify({"message": "Event updated"})


@app.route("/events/<id>", methods=["DELETE"])
def delete_event(id):
    events.delete_one({"_id": ObjectId(id)})
    return jsonify({"message": "Event deleted"})


if __name__ == "__main__":
    app.run(debug=False)
