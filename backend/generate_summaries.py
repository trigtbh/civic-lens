from dotenv import load_dotenv
load_dotenv()

import os

mongo_uri = os.getenv("MONGO_URI")
from pymongo import MongoClient
client = MongoClient(mongo_uri)


db = client["civiclens"]["bills"]
summaries = client["civiclens"]["summaries"]

from transformers import pipeline, AutoTokenizer
#import bullet_points

# Load summarizer (CPU only: device=-1)
summarizer = pipeline("summarization", model="sshleifer/distilbart-cnn-12-6", device=-1)
#summarizer2 = pipeline("summarization", model="allenai/led-base-16384", device=-1)


from openai import OpenAI
client = OpenAI(api_key=os.getenv("OPENAI_KEY"), timeout=900.0)

def chunk_text(text, chunk_size=400, overlap=50):
    """Split text into overlapping word chunks"""
    words = text.split()
    for i in range(0, len(words), chunk_size - overlap):
        yield " ".join(words[i:i+chunk_size])

def summarize_bill(text):
    # Step 1: summarize chunks into ~1 sentence each
    chunk_summaries = []
    for chunk in chunk_text(text):
        summary = summarizer(
            "Write one short plain-English sentence about the main point:\n\n" + chunk,
            max_length=40,
            min_length=10,
            do_sample=False
        )[0]['summary_text']
        chunk_summaries.append(summary)



    # Step 2: collapse into a 2-sentence summary
    draft_summary = summarizer(
        "Summarize this bill in no more than two plain-English sentences, avoiding legal definitions:\n\n" 
        + " ".join(chunk_summaries),
        max_length=100,
        min_length=20,
        do_sample=False
    )[0]['summary_text']

    # Step 3: rewrite cleanly into exactly 2 sentences
    final_summary = summarizer(
        "Rewrite the following text into one clear sentence, avoiding legal definitions:\n\n" + draft_summary,
        max_length=100,
        min_length=20,
        do_sample=False
    )[0]['summary_text']



    sentences = final_summary.split(' . ')
    return sentences[0].strip() + '.'
    #return final_summary
import time
for bill in db.find({}):
    if "text" not in bill or not bill["text"]:
        continue

    if summaries.find_one({"_id": bill["_id"]}):
        continue

    text = bill["text"].replace("\n", " ").replace("\r", " ").replace("\t", " ")
    

    payload = {
        "prompt": f"Tell me what this bill does in 3 bullet points\n\n{text}\n\nBPs:\n",
        #"prompt": "tell me a joke",
        "max_tokens": 150,
        "stream": False,
        "model": "phi4-mini:3.8b" 
    }


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

