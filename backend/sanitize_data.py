
from dotenv import load_dotenv
load_dotenv()

import os
mongo_uri = os.getenv("MONGO_URI")
from pymongo import MongoClient
client = MongoClient(mongo_uri)

db = client["civiclens"]["bills"]

for item in db.find({}):
    if not item["_id"].startswith("HB"):
        db.delete_one({"_id": item["_id"]})