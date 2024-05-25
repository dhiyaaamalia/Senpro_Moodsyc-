import requests

query_text = "Kemarin saya putus dengan pacar saya. Saya merasa patah hati dan sedih sekali."

url = 'http://localhost:5000/api'
r = requests.get(f'{url}/search', params={'query': query_text})

if r.status_code == 200:
    # Parse the JSON response
    song_titles = r.json()
    print("Song Titles:")
    for title in song_titles:
        print(title)
else:
    print("Error:", r.text)