import flask
import os
from flask import Blueprint, jsonify, request
from flask_cors import CORS, cross_origin
import requests
from dotenv import load_dotenv

# Load environment variables as early as possible
load_dotenv()

# Global variable to store assistant settings
ASSISTANT_SETTINGS = {}

def load_assistant_settings():
    """
    Function to load assistant settings.
    In the future, this could be replaced with an API call to fetch the settings.
    For now, it loads hardcoded settings.
    """
    global ASSISTANT_SETTINGS
    
    # Hardcoded assistant settings
    ASSISTANT_SETTINGS = {
        "test-assistant-1": {
            "MODEL_ID": "gpt-4o-mini",
            "ROLE_ID": "c4da2c8e-dd83-4d68-a22b-31334a7cd6a3",
            "SELECTED_FILES": ["66df99f8-1abe-4c8a-96ee-56edef357536_tester_file.pdf"],
            "SELECTED_DATA_COLLECTIONS": [],
            "TEMPERATURE": 0.7,
            "MODE": "BASIC"
        },
        "test-assistant-2": {
            "MODEL_ID": "gpt-4o-mini",
            "ROLE_ID": "8643d3f1-37c3-4ed3-87f7-ffeffac40db7",
            "SELECTED_FILES": ["66df99f8-1abe-4c8a-96ee-56edef357536_debug_file.pdf"],
            "SELECTED_DATA_COLLECTIONS": [],
            "TEMPERATURE": 0.5,
            "MODE": "QA"
        },
        "assistant-LinzAG-Sport": {
            "MODEL_ID": "gpt-4o-mini",
            "ROLE_ID": "1234abcd-5678-efgh-ijkl-9012mnop3456",
            "SELECTED_FILES": ["66df99f8-1abe-4c8a-96ee-56edef357536_LinzAG_sport.docx"],
            "SELECTED_DATA_COLLECTIONS": [],
            "TEMPERATURE": 0.7,
            "MODE": "BASIC"
        }
    }
    
    #print(f"Loaded {len(ASSISTANT_SETTINGS)} assistant configurations")
    return ASSISTANT_SETTINGS

class ChatBotService:
    # Class-level configuration
    API_URL = os.getenv("API_URL")
    API_KEY = os.getenv("API_KEY")
    API_ORGANIZATION_ID = os.getenv("API_ORGANIZATION_ID")
    
    def __init__(self, public_cors_origins=None, private_cors_origins=None):
        # Load environment variables
        load_dotenv()
        
        # Store CORS origins
        self.public_cors_origins = public_cors_origins or []
        self.private_cors_origins = private_cors_origins or []
        
        # Load assistant settings
        load_assistant_settings()
        
        # Create the blueprint with all routes
        self.api = self._create_blueprint()
        
        print("ChatBot service initialized.")
    
    def _create_blueprint(self):
        # Create a new blueprint
        api_bp = Blueprint("api", __name__)
        
        # Define basic routes
        @api_bp.route('/')
        def hello_geek():
            return '<h1>Please enter a valid route!</h1>'
        
        @api_bp.route('/hello')
        def hello():
            print("Welcome to the ocr service API")
            return "<h1>Welcome to the Chatpot Prototype service API</h1>"
        
        @api_bp.get("/status")
        def get_status():
            print("Service is running")
            return jsonify({"message": "Service is running"}), 200
        
        # Public chat endpoint
        @api_bp.route('/v1/public/chat', methods=['POST']) # puplic/chat
        @cross_origin(origins=self.public_cors_origins)
        def public_chat():
            return self._handle_chat_request()
        
        # Private chat endpoint
        @api_bp.route('/v1/private/chat', methods=['POST'])  # puplic/chat
        @cross_origin(origins=self.private_cors_origins)
        def private_chat():
            return self._handle_chat_request()
        
        # Settings reload endpoint
        @api_bp.route('/v1/reload-settings', methods=['POST'])
        @cross_origin(origins=self.private_cors_origins)
        def reload_settings():
            # In the future, this would make an API call
            # For now, just reload the hardcoded settings
            settings = load_assistant_settings()
            return jsonify({"message": "Settings reloaded successfully", "settings": settings}), 200
        
        return api_bp
    
    def _handle_chat_request(self):
        """
        Common chat handling logic for both public and private endpoints
        """
        # The existing chat logic from the chat() function
        try:
            data = request.json
            if not data:
                return jsonify({"error": "Request body must contain JSON data"}), 400
            
            #print("Received data:", data)
            
            # Get assistant ID from request
            assistant_id = data.get("assistantId")
            #print("assistantId:", assistant_id)
            
            # Check if assistant ID exists in settings
            if assistant_id not in ASSISTANT_SETTINGS:
                return jsonify({
                    "error": f"Assistant ID '{assistant_id}' not found in configuration"
                }), 400
            
            # Get configuration for this assistant
            assistant_config = ASSISTANT_SETTINGS[assistant_id]
            
            payload = {
                "model": {"id": assistant_config["MODEL_ID"]},
                "messages": data.get("messages", []),
                "roleId": assistant_config["ROLE_ID"], 
                "temperature": assistant_config["TEMPERATURE"],
                "selectedMode": assistant_config["MODE"],
                "selectedFiles": assistant_config["SELECTED_FILES"],
                "selectedDataCollections": assistant_config["SELECTED_DATA_COLLECTIONS"]
            }
            
            headers = {
                "Content-Type": "application/json",
                "api-key": self.API_KEY,
                "api-organization-id": self.API_ORGANIZATION_ID
            }
            
            # Send the POST request to the API
            response = requests.post(self.API_URL, json=payload, headers=headers, stream=True)
            #print("Response status code:", response.status_code)
            
            if response.status_code == 200:
                # Process the streaming response to extract `data:` fields
                response_text = ""
                for line in response.iter_lines():
                    decoded_line = line.decode("utf-8")
                    #print(f"Response line: {decoded_line}")  # Add this line
                    if decoded_line.startswith("data:"):
                        response_text += decoded_line[5:].strip() + "\n"
                
                #print(f"Final response content: {response_text}")  # Add this line
                return jsonify({"response": response_text.strip()}), 200
            else:
                try:
                    error_details = response.json()
                except ValueError:
                    error_details = {"error": "Non-JSON response", "details": response.text}
                return jsonify({"error": "API call failed", "details": error_details}), response.status_code
        except Exception as e:
            return jsonify({"error": str(e)}), 500

# Load assistant settings when the module is imported
load_assistant_settings()