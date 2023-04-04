"""
This file is part of a chatbot application.

(c) 2023 IshwarMhase

For license information, see LICENSE.txt.
"""

import json
from flask import Flask, jsonify, render_template, request

# create a Flask web application instance
app = Flask(__name__)

# define the default route to render the index.html file
@app.route("/")
def index():
    return render_template("index.html")

# define the route to get a response from the bot
@app.route("/get_bot_response", methods=["POST"])
def get_bot_response():
    # get the message from the POST request
    message = request.json["message"]
    # open and load the data from the data.json file
    with open("data.json", "r") as f:
        data = json.load(f)
    # get the response from the data based on the message
    response = data.get(message, "I'm sorry, I don't understand.")
    
    # if the response is not found in the data, get some suggestions
    if response == "I'm sorry, I don't understand.":
        suggestions = []
        # loop through the keys in the data to find suggestions
        for key in data.keys():
            if message in key:
                suggestions.append(key)
        # if there are suggestions, create quick reply buttons
        if len(suggestions) > 0:
            buttons = []
            for suggestion in suggestions:
                buttons.append({
                    "title": suggestion,
                    "payload": suggestion
                })
            # set the response as a message with quick reply buttons
            response = {
                "text": "Suggestions:-",
                "quick_replies": buttons
            }
    
    # return the response as a JSON object
    return jsonify({"response": response})

# run the application in debug mode
if __name__ == '__main__':
    app.run(debug=True)
