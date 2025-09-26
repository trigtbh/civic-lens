#
from transformers.utils import logging

# This will suppress all messages below the ERROR level
logging.set_verbosity_error()


from transformers import pipeline



classifier = pipeline("zero-shot-classification",
                      model="knowledgator/comprehend_it-base")


#text = ""
#line = "x"
#while line != "":
#    line = input()
#    text = text + line + "\n"

#print(len(text))

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

