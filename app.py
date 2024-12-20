import flask.app
from flask import Flask
import os
from chat_bot_service import chat_bot_service
from dotenv import load_dotenv
from flask_cors import CORS


"""
Start of the flask application.
"""

def create_app(use_config: bool = False) -> flask.app.Flask:
    """
    Creates the Flask app.
    Config files and APIs need to be registered here.
    :return: The Flask app.

    """
    load_dotenv()

    # create and configure the app
    flask_app = Flask(__name__)
    CORS(flask_app)  # Enable CORS for all routes  # for testing 
    if use_config:
        flask_app.config.from_pyfile("config.py")

    # Initialize the OCR instance
    chat_instance = chat_bot_service.ChatBotService()

    flask_app.register_blueprint(chat_instance.api, url_prefix="/api")
    return flask_app


if __name__ == "__main__":
    #host and port will only work in local testing
    port = os.environ.get("PORT")
    host = os.environ.get("HOST")
    app = create_app()
    app.run(host=host, port=port, threaded=True, debug=True)
