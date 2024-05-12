import nltk
from nltk.tokenize import word_tokenize
nltk.download('punkt')

import re
from transformers import pipeline

def fixSingkatan(text):
    text = re.sub(r'\b(aj|ae|aja)\b', 'saja', text)
    text = re.sub(r'\b(ak|gue|gw)\b','aku', text)
    text = re.sub(r'\b(belom|blm)\b', 'belum', text)
    text = re.sub(r'\b(bgt|bngt)\b', 'banget', text)
    text = re.sub(r'\b(bnyk|byk)\b', 'banyak', text)
    text = re.sub(r'\b(dlm)\b', 'dalam', text)
    text = re.sub(r'\b(dr)\b', 'dari', text)
    text = re.sub(r'\b(dg|dgn)\b','dengan',text )
    text = re.sub(r'\b(dpt|dapet)\b', 'dapat', text)
    text = re.sub(r'\b(duar+)\b', 'duar', text)
    text = re.sub(r'\b(emg|emang)\b', 'memang', text)
    text = re.sub(r'\b(gt|gtu)\b', 'gitu', text)
    text = re.sub(r'\b(gatau)\b', 'tidak tau', text)
    text = re.sub(r'\b(gaada)\b', 'tidak ada', text)
    text = re.sub(r'\b(gamau)\b', 'tidak mau', text)
    text = re.sub(r'\b(gimana|gmn)\b', 'bagaimana', text)
    text = re.sub(r'\b(jgn)\b', 'jangan', text)
    text = re.sub(r'\b(jgn2|jangan2)\b', 'jangan jangan', text)
    text = re.sub(r'\b(jd|jdi)\b', 'jadi', text)
    text = re.sub(r'\b(karna|krn|krna)\b', 'karena', text)
    text = re.sub(r'\b(kyk|kek)\b', 'kayak', text)
    text = re.sub(r'\b(kl|klo|kalo)\b', 'kalau', text)
    text = re.sub(r'\b(klian)\b', 'kalian', text)
    text = re.sub(r'\b(knp)\b', 'kenapa', text)
    text = re.sub(r'\b(kpd)\b', 'kepada', text)
    text = re.sub(r'\b(lg)\b', 'lagi', text)
    text = re.sub(r'\b(lgsg)\b', 'langsung', text)
    text = re.sub(r'\b(mrk)\b', 'mereka', text)
    text = re.sub(r'\b(pd)\b', 'pada', text)
    text = re.sub(r'\b(pdhl)\b', 'padahal', text)
    text = re.sub(r'\b(pake)\b', 'pakai', text)
    text = re.sub(r'\b(org)\b', 'orang', text)
    text = re.sub(r'\b(org2)\b', 'orang orang', text)
    text = re.sub(r'\b(sbg)\b', 'sebagai', text)
    text = re.sub(r'\b(skrg)\b', 'sekarang', text)
    text = re.sub(r'\b(sm)\b', 'sama', text)
    text = re.sub(r'\b(spt)\b', 'seperti', text)
    text = re.sub(r'\b(dah|sdh|udh|udah)\b', 'sudah', text)
    text = re.sub(r'\b(tp|tpi)\b', 'tapi', text)
    text = re.sub(r'\b(tiba2|tbtb|tb2)\b', 'tiba tiba', text)
    text = re.sub(r'\b(ga|gak|ngga)\b', 'tidak', text)
    text = re.sub(r'\b(td|tdi)\b', 'tadi', text)
    text = re.sub(r'\b(tdk|g|ga|gak|gk|engga|enggak|ngga|nggak|kaga|kagak)\b', 'tidak', text)
    text = re.sub(r'\b(trus|trs)\b', 'terus', text)
    text = re.sub(r'\b(tsb)\b', 'tersebut', text)
    text = re.sub(r'\b(ttg)\b', 'tentang', text)
    text = re.sub(r'\b(utk)\b', 'untuk', text)
    text = re.sub(r'\b(ya+h*)\b', 'ya', text)
    text = re.sub(r'\b(yg)\b', 'yang', text)
    return text

def preprocess(input_text):
    # Read stopwords from the text file
    with open('stopwords-id.txt', 'r') as file:
        custom_stopwords = file.read().splitlines()

    # Tokenize the text
    words = word_tokenize(input_text)

    # Remove stopwords
    filtered_words = [word for word in words if word.lower() not in custom_stopwords]

    # Join the filtered words back into a sentence
    filtered_text = ' '.join(filtered_words)

    filtered_text = fixSingkatan(filtered_text)

    s = re.sub(r'[^\w\s]','',filtered_text)
    s = re.sub('  +', ' ', s)
    s = s.lower()

    return s

def predict(input_key):
    nlp = pipeline("text-classification", model="thoriqfy/indobert-emotion-classification")
    emotion = nlp(input_key)

    return emotion