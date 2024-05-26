from flask import Flask, request, jsonify
import re

from dotenv import load_dotenv
import os

from model import preprocess, get_access_token, predict_emotion, search_playlists, search_playlist_tracks
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Define your preprocess, get_access_token, predict_emotion, search_playlists, search_playlist_tracks functions here

load_dotenv()
client_id = os.getenv('NEXT_PUBLIC_SPOTIFY_CLIENT_ID')
client_secret = os.getenv('NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET')


@app.route('/search', methods=['POST'])
def search_song_titles():
    data = request.get_json()
    input_text = data.get('query')
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
    if emotion == "neutral": 
        response = {
            "success": False,
            "message": "Berikan cerita yang lebih detail.",
            "song": []
        }
        return jsonify(response)

    genre = emotion_genre_mapping[emotion][0]


    # Search for playlists
    response = search_playlists(encoded_playlist_name, genre, access_token)

    # Extract the playlist IDs
    playlist_ids = []
    if response['playlists']['items']:
        for playlist in response['playlists']['items']:
            playlist_ids.append(playlist['id'])

    # Get tracks from each playlist
    song_list = []
    for playlist_id in playlist_ids:
        playlist_tracks = search_playlist_tracks(playlist_id, access_token)
        if 'items' in playlist_tracks:
            for track in playlist_tracks['items']:
                track_song = track['track']
                song_list.append(track_song)

    response = {
        "success": True,
        "message": "Berhasil",
        "song": song_list
    }

    # Return the song titles
    if song_list:
        response = {
            "success": True,
            "message": "Berhasil",
            "song": song_list
        }
        return jsonify(response)
    else:
        return jsonify({"message": "No songs found in the playlists."})

if __name__ == '__main__':
    app.run(debug=True)