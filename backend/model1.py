# Library
import nltk
import string
nltk.download(["stopwords", "vader_lexicon", "punkt", "wordnet"])
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize, sent_tokenize
from nltk.stem import WordNetLemmatizer
from nltk.tokenize import RegexpTokenizer
from numpy import asarray
from transformers import pipeline
from collections import Counter
import matplotlib.pyplot as plt
from nltk.sentiment import SentimentIntensityAnalyzer
import os

# Data cleaning and preprocessing
text = input("Masukkan teks: ")
stop_words = stopwords.words('indonesian')

def preprocess_text(text):
    # Tokenize words & ignore punctuation
    tokeniser = RegexpTokenizer(r'\w+')
    tokens = tokeniser.tokenize(text)
    data_token = [token.lower() for token in tokens]
    processed_words = [w for w in data_token if not w in stop_words]
    return processed_words

print(text)
cleaned_text = preprocess_text(text)
print(cleaned_text)

lemma_words = []
lemmatizer = WordNetLemmatizer()
for word in cleaned_text:
    word = lemmatizer.lemmatize(word)
    lemma_words.append(word)

# Sentiment analysis
emotion_list = []
script_dir = os.path.dirname(__file__) 
file_path = os.path.join(script_dir, 'emotions.txt') 
with open(file_path, 'r') as file:
    for line in file:
        clear_line = line.strip()  # Remove leading and trailing whitespace
        if ':' in clear_line:  # Check if the line contains a colon
            word, emotion = clear_line.split(':', 1)  # Split at the first colon
            if word in cleaned_text:
                emotion_list.append(emotion)
        else:
            print(f"Ignoring line '{clear_line}' in emotions.txt as it doesn't contain a valid word:emotion pair.")

print(emotion_list)
w = Counter(emotion_list)
print(w)

classifier = pipeline("sentiment-analysis", model="w11wo/indonesian-roberta-base-sentiment-classifier")

def sentiment_analyse(sentiment_text):
    result = classifier(sentiment_text)
    label = result[0]['label']
    if label == 'NEGATIVE':
        print("Negative Sentiment")
    elif label == 'POSITIVE':
        print("Positive Sentiment")
    else:
        print("Neutral Sentiment")

# Use the original text for sentiment analysis
sentiment_analyse(cleaned_text)

#fig, ax1 = plt.subplots()
#ax1.bar(w.keys(), w.values())
#fig.autofmt_xdate()
#plt.savefig('graph.png')
#plt.show()
