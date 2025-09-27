from dotenv import load_dotenv
load_dotenv()

import os

LEGISCAN_KEY = os.getenv("LEGISCAN_KEY")
CONGRESS_GOV_KEY = os.getenv("CONGRESS_GOV_KEY")

import requests
endpoint = f"https://api.legiscan.com/?key={LEGISCAN_KEY}&op=getMasterList&state=US"

resp = requests.get(endpoint)
import os

links = {}

if resp.status_code == 200:
    data = resp.json()
    ml = data["masterlist"]
    session_data = ml["session"]
    session_no = session_data["session_name"].lower().split(" ")[0].strip("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ").strip("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ")

    bills = [
        v for k, v in ml.items() if isinstance(v, dict) and k != "session"
    ]

    for bill in bills:
        if bill["status"] == 2 and bill["number"][1] != "R": # active, not just introduced
            billtype = ""
            billno = ""
            for char in bill["number"]:
                if char.isdigit():
                    billno += char
                else:
                    if char == "B": char = "R"
                    billtype += char
            links[bill["number"]] = f"https://api.congress.gov/v3/bill/{session_no}/{billtype.lower()}/{billno}"
    

input(f"{len(links.items())} bills found. Press Enter to begin scraping.")


mongo_uri = os.getenv("MONGO_URI")
from pymongo import MongoClient
client = MongoClient(mongo_uri)
db = client["civiclens"]["bills"]

final = {}
import time

for k, v in links.items():
    resp = requests.get(v + "?format=json&api_key=" + CONGRESS_GOV_KEY)
    d = {}
    if resp.status_code == 200:

        resp_data = resp.json()["bill"]
        textversions = resp_data.get("textVersions", [])["url"]
        resp2 = requests.get(textversions + "?format=json&api_key=" + CONGRESS_GOV_KEY)
        if resp2.status_code == 200:
            resp2_data = resp2.json()
            ver = resp2_data["textVersions"][-1]["formats"][0] # formatted text guaranteed to always be first? unsure
            text = requests.get(ver["url"]).text
            d["text"] = text
        d["title"] = k

    final[k] = d

    d["_id"] = k

    
    db.insert_one(d)


    time.sleep(1) # avoid rate limiting
    print(f"Inserted {k}")
