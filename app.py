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
    
    # Get CORS origins from environment
    public_cors_origins = os.getenv("PUBLIC_CORS_ORIGINS", "").split(",")
    private_cors_origins = os.getenv("PRIVATE_CORS_ORIGINS", "").split(",")
    
    # create and configure the app
    flask_app = Flask(__name__)
    
    # Instead of app-wide CORS, we'll set it per route
    # We'll keep a basic CORS setup for non-API routes
    CORS(flask_app)
    
    if use_config:
        flask_app.config.from_pyfile("config.py")
    
    # Pass the CORS settings to the ChatBotService
    chat_instance = chat_bot_service.ChatBotService(
        public_cors_origins=public_cors_origins,
        private_cors_origins=private_cors_origins
    )
    
    flask_app.register_blueprint(chat_instance.api, url_prefix="/api")
    return flask_app

# Vercel expects `app` or `handler` to be at the module level
app = create_app()  # This line is required for Vercel to detect the app

if __name__ == "__main__":
    #host and port will only work in local testing
    port = os.environ.get("PORT")
    #host = os.environ.get("HOST")
    host = os.environ.get("HOST", "0.0.0.0") # for versel 
    app = create_app()
    app.run(host=host, port=port, threaded=True, debug=False)
