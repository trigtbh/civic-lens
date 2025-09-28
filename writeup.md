# Civic Lens Writeup
This is a writeup for the Civic Lens app, an AI-powered tool that delivers insights into active legislation.

## 0. Motivation
Initially I wanted to make an app for UW's [DubHacks 2025](https://dh25.dubhacks.co). Having built an app for the previous year, I knew this year I wanted to go into the hackathon with an idea that had a shot at winning.

Looking at the available tracks, I noticed that citizen advocacy was one of the mentioned traits for one of the tracks. I could only come up with laws and legislation for this track, so I thought "Legislation + AI will win this!" (since many of the apps from last year used generative AI in some capacity). However, the more I looked into it, the more I realized just how unapproachable the laws are in many cases. I remembered getting my voters' pamphlet last year and seeing the measures to vote on, and thinking "I can obviously read what these are about, but with only a certain amount of time before the ballots are due I won't know much about these measures that I only heard of today". 

I also thought of my parents - they both spoke Spanish as their first language, but also knew English fluently. Had they only known Spanish, or any language that isn't commonly translated to in legal texts (my county does not translate its pamphlets into Hindi or Farsi, for example) then they would have a hard time understanding what it is that they're voting for. 

From this I closed in on the app's initial goal - **helping make legislative texts more accessible to other people**. My DubHacks group this year didn't end up choosing this idea, but as a result I was able to fully execute it as I saw fit.

## 1. Zero-shot Models
The very first thing that I wanted to do for the app was make it show measures that were directly relevant to the end user. For example, one user might have two children in middle school, so they would care strongly about legislation that affects education. A different user might live alone but with a high paying job, so they might care more about laws pertaining to the economy. 

Every user would have different key issues that the app should attempt to cater to all at once. This starts by trying to figure out what categories each bill belongs to. Normally I'd use some form of LLM to categorize it, but to avoid hallucination and get numerical-ish responses, I decided to steer away from those entirely.

Initially I looked for some transformer model that was designed to do this. After a bit of research, I realized no such model existed at the level of usability I desired. Instead, I stumbled upon zero-shot models - models created for general inference but without any predefined training data, so they could be applicable for a wide variety of use cases. Ideally, I'd be able to pass in the full text of any bill and have the model determine which categories it best falls under.

Flip-flopping between a few different models, the one I found that gave reasonable responses in almost all tests was the `knowledgator/comprehend_it-base` base. One unintended upside of using this model is, compared to any form of locally-running LLM model, it runs considerably quickly and has a very small memory/storage footprint. Since I was running it on a CPU-focused ARM server with no dedicated GPU, anything that could be performant without specialized hardware was a bonus.

## 2. Translation
In my initial research I banked a lot on using AWS technologies as stand-ins for key features, since I was designing the app with DubHacks in mind. Knowing Amazon would be sponsoring and tabling at the hackathon, I thought using their technologies was a good way to get the project into their radar (also partially incentivized by the free credits they gave us).

However, with the project no longer being part of the hackathon and having some time to actually test out what AWS could do, I came to the conclusion that it was *miserable* to work with, solely from being extremely convoluted. [I'm not the only one](https://news.ycombinator.com/item?id=20902786) that thinks this, either. This exact issue comes up multiple times in the project's lifespan as the **AWS Problem**.

One of these technologies that I thought of was app-wide translation, where every element would be translated to a user's preferred language. This would have been accomplished with AWS Translate, but with AWS out, I had to find something to replace it. Initial research showed there aren't a lot of *free* translation APIs, which I was strictly looking for to minimize costs as much as I can (I had not thought of a working monetization plan at this time). 

Eventually, I stumbled upon [Libretranslate](https://libretranslate.com/), or LT for short. While on its own it isn't necessarily free to use, it does provide an option to self-host. I ended up using this self-hosted option to translate all category labels, as well as other text elements such as the names for each language, *in the language itself* (AKA the endonym of the language) to improve usability in as many users as possible.

## 3. Bill Data
With basic classification out of the way and a framework for translating, I began looking for the fulltext for active legislation. The way I iniitally saw it was I'd be able to start small and work my way out - beginning at the city/county level, then potentially adding state and national legislation - since that's what I had the most experience reading. Out of curiosity I googled `congress api` and found that the United States Congress had its own API system where you could search up and retrieve fulltexts for any bill brought up in the current congressional session. 

*Note: for brevity's sake from this point forward I will abbreviate the official Congress API as* `CAPI`.

With some additional searching I found a second API, Legiscan. Legiscan produced roughly the same data about active legislation but with 3 major distinctions:

1. While CAPI has a very generous rate-limit, Legiscan has a very concrete limit of 30,000 requests per month. This limit is alleviated by one of its endpoints allowing for a total bulk download of every bill, which by requesting only uses 1 request of the monthly 30,000.

2. CAPI, for good reason, displays every single bill introduced. This includes bogus bills such as those that have been flat-out rejected or ones that are merely introduced and have been that way for months. It becomes difficult to see which ones are actually gaining traction (which I defined as "has this passed at least one chamber?") because there's no easy distinction or indication made that it has. This is unlike the official [Congress search page](https://congress.gov/) which has a checkbox specifically for this attribute. It is also unlike Legiscan's data, which has a specific status attribute that determines this (a `1` means it was merely introduced, whereas a `2` means it has passed one chamber). Moreover, if a bill is plainly not present in Legiscan's data, that means it is completely inactive/dead.

3. A minor quirk that can be easily resolved, but a tricky one to spot: Legiscan and CAPI do not use the same nomenclature for bills. The People CARE act (H.R. 150) is written as HB150 in Legiscan, but has a CAPI endpoint of `.../hr/150`. Legiscan also contains bills starting with HR, but those are reserved for House Resolutions - HR150 in Legiscan is listed as H. Res. 150 on CAPI and requested as such. 

Once both APIs were managed, I devised an automated way of getting the data on every bill: first by requesting every bill in bulk from Legiscan, combing through the data to find all the active bills, then using CAPI to grab their fulltexts before storing everything in a MongoDB database.


## 4. Summaries
One of the other core features I wanted to implement was key summaries for every bill - what it was and exactly what it would change/do. With this data, any user could quickly read and understand what a bill would try to do (with additional translation support if required). 

The obvious answer to this challenge would be to use some form of LLM. At first, I wanted to minimize costs as much as possible within the scope of the project. Very quickly, however, I ran into the AWS Problem again - I was going to use Bedrock to request some model to summarize the fulltexts into a sentence and some bullet points, but without AWS I had to look for something else.

My first thought was to use locally running LLMs. However, many that I tried to use (as a non-exhaustive list of Ollama models, `phi3:3.8b`, `lstep/neuraldaredevil-8b-abliterated`, and `phi4-mini`) ended up crashing or timing out due to not being able to fit the entire fulltext for any bill in its context window. 

From there, my second idea was to use another transformers model like with the zero-shot classification, summarize small chunks of the text, then summarize those summaries into a single sentence. For the most part this did actually get me what I wanted. 

The trickier part came with the bullet points. I tried using the same approach, except instead of "Generate a single sentence" in the prompt I wrote "Generate 3 bullet points". This would never give me any usable data, just a bunch of blank space (left over from the original text) or useless tokens. Once again, I bounced back to the local LLMs which were again not useful.

After a while, I bit the bullet and looked at OpenAI's pricing for `gpt-5-nano`. It was extremely inexpensive - 1M input tokens for $0.05, and 1M output tokens for $0.40. My thought process was I could just spend $5 and use the model to fully summarize the bills as I saw fit. I tried it with just one bill and it did exactly what I asked it to - one pristine summary and 3 easy-to-follow bullet points. I decided to pass through every single bill I had on hand, and after around 20 minutes it fully summarized all the bills, costing only $0.30.