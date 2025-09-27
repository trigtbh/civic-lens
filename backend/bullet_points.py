import torch
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM, pipeline

# 1. Load the model and tokenizer

summarizer = pipeline("text2text-generation", model="t5-large")
# Assuming 'combined_summaries' is the text you got from summarizing the chunks
combined_summaries = "..." # Paste your concatenated summaries here

# 2. Create your detailed prompt


def bps(text):

    # 2. Prepare the input for the ENCODER
# The encoder should ONLY see the text you want it to summarize.
# No instructions, no prompts.
    prompt = f"summarize: Extract three main actions from this legislative text: {text}"
    
    result = summarizer(
        prompt,
        max_length=300,
        min_length=20,
        do_sample=False
    )[0]['generated_text']

    print(result)

    return ""
    return bullet_point_summary