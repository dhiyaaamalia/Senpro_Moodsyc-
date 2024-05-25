from flask import Flask, request, jsonify, render_template
import os
import requests
import base64
import re
from transformers import pipeline
import nltk
from nltk.tokenize import word_tokenize
nltk.download('punkt')

app = Flask(__name__)

# Spotify API credentials
client_id = '7b6e0c37a32f40b88acbe29807c880ba'
client_secret = 'd4f2e1d468b543a898821f1d6919cdd5'

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
    script_dir = os.path.dirname(os.path.abspath(__file__))
    stopwords_path = os.path.join(script_dir, 'stopwords-id.txt')

    with open(stopwords_path, 'r') as file:
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
    s = s.lower().strip()

    return s

def predict_emotion(input_key):
    nlp = pipeline("text-classification", model="thoriqfy/indobert-emotion-classification")
    emotion = nlp(input_key)
    emotion = emotion[0]['label']
    emotion = emotion.lower()

    return emotion

def get_access_token(client_id, client_secret):
    auth_string = f"{client_id}:{client_secret}"
    auth_bytes = auth_string.encode('ascii')
    auth_base64 = base64.b64encode(auth_bytes).decode('ascii')

    headers = {
        'Authorization': f'Basic {auth_base64}',
        'Content-Type': 'application/x-www-form-urlencoded'
    }
    data = {'grant_type': 'client_credentials'}

    response = requests.post('https://accounts.spotify.com/api/token', headers=headers, data=data)
    return response.json().get('access_token')

def search_playlists(query, genre, token):
    url = 'https://api.spotify.com/v1/search'
    headers = {
        'Authorization': f'Bearer {token}'
    }
    params = {
        'q': query + '%20genre:' + genre,
        'type': 'playlist',
        'limit': 1  # Number of results to return
    }

    response = requests.get(url, headers=headers, params=params)
    return response.json()

def search_playlist_tracks(playlist_id, token):
    url = f'https://api.spotify.com/v1/playlists/{playlist_id}/tracks'
    headers = {
        'Authorization': f'Bearer {token}'
    }
    response = requests.get(url, headers=headers)
    return response.json()

@app.route('/search', methods=['GET'])
def search_song_titles():
    input_text = request.args.get('query')
    playlist_name = preprocess(input_text)

    access_token = get_access_token(client_id, client_secret)

    # Replace spaces with %20
    encoded_playlist_name = re.sub(r'\s', '%20', playlist_name)

    emotion_genre_mapping = {
        "sadness": ["blues", "classical", "acoustic", "soul", "indie"],
        "anger": ["metal", "rock", "punk", "hardcore", "industrial"],
        "love": ["pop", "r&b", "love songs", "ballads", "jazz"],
        "fear": ["darkwave", "gothic", "horror", "ambient", "soundtrack"],
        "happy": ["pop", "dance", "electronic", "reggae", "funk", "disco"]
    }

    emotion = predict_emotion(playlist_name)
    genre = emotion_genre_mapping[emotion][0]

    # Search for playlists
    response = search_playlists(encoded_playlist_name, genre, access_token)

    # Extract the playlist IDs
    playlist_ids = []
    if response['playlists']['items']:
        for playlist in response['playlists']['items']:
            playlist_ids.append(playlist['id'])

    # Get tracks from each playlist
    song_titles = []
    for playlist_id in playlist_ids:
        playlist_tracks = search_playlist_tracks(playlist_id, access_token)
        if 'items' in playlist_tracks:
            for track in playlist_tracks['items']:
                song_title = track['track']['name']
                song_titles.append(song_title)

    # Return the song titles
    if song_titles:
        return jsonify(song_titles)
    else:
        return jsonify({"message": "No songs found in the playlists."})


if __name__ == '__main__':
    app.run(debug=True)