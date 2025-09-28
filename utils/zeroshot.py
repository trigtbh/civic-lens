# expects to be run as zeroshot.py [path to bill text]
# output printed directly to stdout. probably entirely in descending order? 


from transformers.utils import logging

logging.set_verbosity_error()


from transformers import pipeline



classifier = pipeline("zero-shot-classification",
                      model="knowledgator/comprehend_it-base")


import sys
with open(sys.argv[1]) as f:
    text = f.read()

#print(text)

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
data = (classifier(text, candidate_labels, multi_label=True))
print(dict(zip(data["labels"], data["scores"])))

