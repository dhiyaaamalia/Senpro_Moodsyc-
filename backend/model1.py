# Library
import nltk
import string
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize, sent_tokenize
from nltk.stem import WordNetLemmatizer
from nltk.tokenize import RegexpTokenizer
from transformers import pipeline
from collections import Counter
import os

nltk.download(["stopwords", "vader_lexicon", "punkt", "wordnet"])

# Load the emotion classification model
pretrained_name = "StevenLimcorn/indonesian-roberta-base-emotion-classifier"
nlp = pipeline(
    "text-classification",
    model=pretrained_name,
    tokenizer=pretrained_name,
    return_all_scores=True  
)

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

# Analisis Emosi
emotion_list = []
script_dir = os.path.dirname(__file__)
file_path = os.path.join(script_dir, 'emotions.txt')
with open(file_path, 'r') as file:
    for line in file:
        clear_line = line.strip()  
        if ':' in clear_line: 
            word, emotion = clear_line.split(':', 1)  
            if word in cleaned_text:
                emotion_list.append(emotion.strip())  # added strip() to remove leading/trailing whitespaces
        else:
            print(f"Ignoring line '{clear_line}' in emotions.txt as it doesn't contain a valid word:emotion pair.")

print(emotion_list)
w = Counter(emotion_list)
print(w)

# Function for emotion analysis using the pretrained model
def emotion_analyse(emotion_text):
    results = nlp(emotion_text)
    threshold = 0.3  
    for result in results[0]:
        if result['score'] >= threshold:
            print(f"Emosi: {result['label']}, Skor: {result['score']}")

emotion_analyse(" ".join(lemma_words))  
