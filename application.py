import os

from flask import Flask, jsonify, render_template, request
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

# list of channels
channels = ["# General"]

# list of users
users = set()


@app.route("/")
def index():
    return render_template("index.html", channels=channels)


@socketio.on("create channel")
def createChannel(data):
    if data in channels:
        emit("error")
    else:
        channels.append(data)
        emit("announce channel creation", data, broadcast=True)
