import requests
import json
import spotipy
from spotipy.oauth2 import SpotifyOAuth

# Set your Spotify API credentials
CLIENT_ID = '51eaca612867457e88c02f5e79aedbbf'
CLIENT_SECRET = 'edfc0fd05a7f491abe0b3e803e041371'
REDIRECT_URI = 'http://localhost:8888/callback'

# Scope for controlling playback
SCOPE = 'user-modify-playback-state user-read-playback-state'

# Authenticate with Spotify
sp = spotipy.Spotify(auth_manager=SpotifyOAuth(client_id=CLIENT_ID,
                                               client_secret=CLIENT_SECRET,
                                               redirect_uri=REDIRECT_URI,
                                               scope=SCOPE))

# Function to play a track
def play_track(track_uri):
    # Start playback
    sp.start_playback(uris=[track_uri])
    print(f"Playing track: {track_uri}")

# Example track URI (replace with a valid track URI)
track_uri = 'spotify:track:http://localhost:8888/callback'  # Replace with a valid track URI

# Play the track
play_track(track_uri)

# Authorization token (it should have been created previously)
token = 'BQBJiQMnX-w4HqzQXjr5ge6L4y4ekUUwZEzmF2nMuXuB_tCl8wyiMLqB59kwjXHLTjyAMpjsK5Cyj28T7z0Pi7eV8yL5Gpe7Ad1LAWMN1wYaW6U75avWg8JM9CRY_-H3cL7MoAPfygQ89t9KG-1OY__z08zDNTiBIHOgI_Vdw7rZ6MYFgffqjmy52JGnKprIueVPBb6x61HK-U8x3tqQfrglQmDP4qg9tvcciZmabOwzYLfOO77u8uRgrLyt1kU3EB8i_9Px7FFulDujIi9a5fPjJYJ_XZrbiqM3aBB6RPRun1beVlbCUV_J'


# Function to fetch data from Spotify Web API
def fetch_web_api(endpoint, method, body=None):
    url = f'https://api.spotify.com/{endpoint}'
    headers = {
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json'
    }

    response = requests.request(method, url, headers=headers, data=json.dumps(body) if body else None)
    response.raise_for_status()  # Raise an exception for HTTP errors
    return response.json()


# Function to get top tracks
def get_top_tracks():
    # Endpoint: https://developer.spotify.com/documentation/web-api/reference/get-users-top-artists-and-tracks
    return fetch_web_api('v1/me/top/tracks?time_range=long_term&limit=10', 'GET')['items']



print("1. Get top 10")
print("2. play music")
choice = int(input("Enter your choice: "))
if choice == 1:
    top_tracks = get_top_tracks()

    for i, track in enumerate(top_tracks, start=1):
        track_name = track['name']
        artists = ", ".join(artist['name'] for artist in track['artists'])
        print(f'{i}. {track_name} by {artists}')