import dotenv
dotenv.load_dotenv()
from transformers.utils import logging
import os
import pymongo
import time

logging.set_verbosity_error()

from transformers import pipeline

print("Loading classification model...")
classifier = pipeline("zero-shot-classification",
                      model="knowledgator/comprehend_it-base",
                      device=-1)  # CPU only
print("Model loaded successfully!")

candidate_labels = [
"agriculture",
"budget",
"economy", 
"crime",
"education",
"environment",
"health",
"housing",
"infrastructure",
"judiciary",
"labor",
"safety",
"transportation"
]

mongo_uri = os.getenv("MONGO_URI")
client = pymongo.MongoClient(mongo_uri)

db = client["civiclens"]["bills"]
target = client["civiclens"]["scores"]

print("Connecting to database...")

# Get list of already categorized item IDs
print("Checking for already categorized items...")
already_categorized = set(doc["_id"] for doc in target.find({}, {"_id": 1}))
print(f"Found {len(already_categorized)} already categorized items")

# Fetch all items to process
print("Fetching items to process...")
items_to_process = list(db.find(
    {"_id": {"$nin": list(already_categorized)}}, 
    {"_id": 1, "text": 1}  # Only fetch needed fields
))

print(f"Found {len(items_to_process)} items to process")

if not items_to_process:
    print("No items to process!")
else:
    INSERT_BATCH_SIZE = 25  # Insert results in batches
    
    total_processed = 0
    start_time = time.time()
    insert_buffer = []
    
    print(f"Starting to process {len(items_to_process)} items...")
    
    # Process items one by one (reliable approach)
    for i, item in enumerate(items_to_process):
        try:
            print(f"Processing item {i+1}/{len(items_to_process)}: {item['_id']}")
            
            text = item["text"]
            data = classifier(text, candidate_labels, multi_label=True)
            
            result = {
                "_id": item["_id"], 
                "scores": dict(zip(data["labels"], data["scores"]))
            }
            
            insert_buffer.append(result)
            total_processed += 1
            
            # Insert when buffer is full
            if len(insert_buffer) >= INSERT_BATCH_SIZE:
                target.insert_many(insert_buffer)
                print(f"✓ Inserted batch of {len(insert_buffer)} scores")
                insert_buffer = []
            
            # Progress update every 5 items
            if total_processed % 5 == 0:
                elapsed = time.time() - start_time
                rate = total_processed / elapsed if elapsed > 0 else 0
                eta = (len(items_to_process) - total_processed) / rate if rate > 0 else 0
                print(f"Progress: {total_processed}/{len(items_to_process)} ({rate:.2f} items/sec, ETA: {eta/60:.1f}min)")
            
        except Exception as e:
            print(f"Error processing item {item['_id']}: {e}")
            continue
    
    # Insert any remaining items
    if insert_buffer:
        target.insert_many(insert_buffer)
        print(f"✓ Inserted final batch of {len(insert_buffer)} scores")
    
    final_time = time.time() - start_time
    print(f"\n🎉 Completed! Processed {total_processed} items in {final_time/60:.1f} minutes ({total_processed/final_time:.2f} items/sec)")
