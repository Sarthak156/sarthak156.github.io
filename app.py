import os
from flask import Flask, request, jsonify, render_template
import pygame
from fuzzywuzzy import process

app = Flask(__name__)

MUSIC_DIR = "music"
pygame.mixer.init()

def find_best_match(song_name):
    files = [f for f in os.listdir(MUSIC_DIR) if f.endswith(".mp3")]
    best_match, _ = process.extractOne(song_name, files)
    return os.path.join(MUSIC_DIR, best_match) if best_match else None

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/play", methods=["POST"])
def play_music():
    song_name = request.json.get("song_name")
    file_path = find_best_match(song_name)

    if file_path:
        pygame.mixer.music.load(file_path)
        pygame.mixer.music.play()
        return jsonify({"status": "playing", "song": os.path.basename(file_path)})
    return jsonify({"status": "error", "message": "No matching song found"})

@app.route("/stop", methods=["POST"])
def stop_music():
    pygame.mixer.music.stop()
    return jsonify({"status": "stopped"})

if __name__ == "__main__":
    app.run(debug=True)
