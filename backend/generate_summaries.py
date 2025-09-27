from dotenv import load_dotenv
load_dotenv()

import os

mongo_uri = os.getenv("MONGO_URI")
from pymongo import MongoClient
client = MongoClient(mongo_uri)
db = client["civiclens"]["bills"]


from transformers import pipeline

# Load summarizer (CPU only: device=-1)
summarizer = pipeline("summarization", model="sshleifer/distilbart-cnn-12-6", device=-1)

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

for bill in db.find({}):
    if "text" not in bill or not bill["text"]:
        continue

    text = bill["text"].replace("\n", " ").replace("\r", " ").replace("\t", " ")
    

    payload = {
        "prompt": f"Summarize the following bill text in 2-3 concise sentences:\n\n{text}\n\nSummary:",
        "max_tokens": 150,
        "stream": False,
        "model": "llama3.1:8b-instruct-q8_0" 
    }

    summary = summarize_bill(text)

    # import requests
    # api_url = "http://localhost:11434/api/generate"
    # response = requests.post(api_url, json=payload)
    # print(response.json())

    print(summary)


    input()





