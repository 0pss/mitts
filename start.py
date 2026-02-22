from flask import Flask, send_from_directory
import os

app = Flask(__name__)

# Route für die Hauptseite
@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

# Route für alle anderen Dateien (js, css, json, assets)
@app.route('/<path:path>')
def static_files(path):
    return send_from_directory('.', path)

if __name__ == '__main__':
    print("Toppi-Server startet auf http://127.0.0.1:5000")
    app.run(debug=True, port=5000)