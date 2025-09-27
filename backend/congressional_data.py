from dotenv import load_dotenv
load_dotenv()

import os

CONGRESS_GOV_KEY = os.getenv("CONGRESS_GOV_KEY")
endpoint = f"https://api.congress.gov/v3/bill/?limit=250&format=json&api_key={CONGRESS_GOV_KEY}"

import requests
resp = requests.get(endpoint)
print(resp.json())