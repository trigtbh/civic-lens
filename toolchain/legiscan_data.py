from dotenv import load_dotenv
load_dotenv()

import os

LEGISCAN_KEY = os.getenv("LEGISCAN_KEY")
CONGRESS_GOV_KEY = os.getenv("CONGRESS_GOV_KEY")

mongo_uri = os.getenv("MONGO_URI")
from pymongo import MongoClient
client = MongoClient(mongo_uri)


base_db = client["civiclens"]

db = client["civiclens"]["bills"]

# grab all _ids already in the database
existing_ids = set(item["_id"] for item in db.find({}, {"_id": 1}))

print(len(existing_ids), "existing bills in database")


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
                    # if char == "B": char = "R"
                    billtype += char
    
            translation = {
                "HB": "HR",
                "HCR": "hconres",
                "HJR": "hjres",

            "SB": "S",
            "SCR": "sconres",
            "SJR": "sjres"

            }
            #bill["number"] = translation.get(bill["number"], bill["number"]).upper() + billno



            links[bill["number"]] = f"https://api.congress.gov/v3/bill/{session_no}/{translation.get(billtype, billtype)}/{billno}"


# links = dict((k, v) for k, v in links.items() if not k.startswith("HB"))



links_to_add = dict((k, v) for k, v in links.items() if k not in existing_ids)
links_to_delete = set(existing_ids) - set(links.keys())



# print(list(links.items())[0])

print(f"{len(links_to_add)} new bills to add\n{len(links_to_delete)} bills to delete\nPress enter to continue.")


for k in links_to_delete:
    base_db["bills"].delete_one({"_id": k})
    base_db["scores"].delete_many({"_id": k})
    base_db["summaries"].delete_many({"_id": k})
    print(f"Deleted {k}")

final = {}
import time

links = {k: v for k, v in links.items() if k in links_to_add}

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
