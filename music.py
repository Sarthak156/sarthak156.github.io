import os
import pygame
from fuzzywuzzy import process

# Folder containing MP3 files
MUSIC_DIR = "music"

def find_best_match(song_name):
    files = [f for f in os.listdir(MUSIC_DIR) if f.endswith(".mp3")]
    best_match, _ = process.extractOne(song_name, files)
    return os.path.join(MUSIC_DIR, best_match) if best_match else None

def play_music(file_path):
    pygame.mixer.init()
    pygame.mixer.music.load(file_path)
    pygame.mixer.music.play()
    input("Press Enter to stop...")
    pygame.mixer.music.stop()

while True:
    user_query = input("Enter song name (or type 'exit' to quit): ").strip().lower()
    if user_query == "exit":
        break
    best_match = find_best_match(user_query)
    if best_match:
        print(f"Playing: {os.path.basename(best_match)}")
        play_music(best_match)
    else:
        print("No matching song found.")
