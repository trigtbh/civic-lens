from dotenv import load_dotenv
load_dotenv()

import os

mongo_uri = os.getenv("MONGO_URI")
from pymongo import MongoClient
client = MongoClient(mongo_uri)


db = client["civiclens"]["bills"]
summaries = client["civiclens"]["summaries"]

from openai import OpenAI
client = OpenAI(api_key=os.getenv("OPENAI_KEY"), timeout=900.0)


# only select ids that exist in db but not in summaries
bills_to_summarize = [bill for bill in db.find({}) if "text" in bill and bill["text"] and not summaries.find_one({"_id": bill["_id"]})]

print(f"{len(bills_to_summarize)} bills to summarize")


import time
for bill in bills_to_summarize:
    if "text" not in bill or not bill["text"]:
        continue

    if summaries.find_one({"_id": bill["_id"]}):
        continue

    text = bill["text"].replace("\n", " ").replace("\r", " ").replace("\t", " ")
    


    a = time.time()
    bullet_points = client.with_options(timeout=900.0).responses.create(
        model="gpt-5-nano",
        instructions=f"Tell me what this bill does in 3 short bullet points",
        input=text,

    )

    summary = client.with_options(timeout=900.0).responses.create(
        model="gpt-5-nano",
        instructions=f"Summarize this bill in one short and clear sentence, avoiding legal definitions",
        input=text,

    ).output_text.strip()

    # print("BP time:", time.time() - a)




    
    bps = bullet_points.output_text.strip().split('\n')
    bps = [line for line in bps if line.strip()]

    bps = [line.strip('- ').strip().strip(".") for line in bps]

    summaries.insert_one({
        "_id": bill["_id"],
        "summary": summary,
        "bullet_points": bps
    })


    print("Saved summary for bill", bill["_id"])

