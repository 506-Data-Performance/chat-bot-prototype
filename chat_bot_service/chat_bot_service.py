import os
import json
from flask import Blueprint, jsonify, request
import pathlib
from flask_cors import CORS, cross_origin
import requests
from dotenv import load_dotenv

# Import the new AWS service
from chat_bot_service.aws_service import AWSService
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
            "MODEL_ID": "gpt-4o",
            "ROLE_ID": "c4da2c8e-dd83-4d68-a22b-31334a7cd6a3",
            "SELECTED_FILES": ["66df99f8-1abe-4c8a-96ee-56edef357536_tester_file.pdf"],
            "SELECTED_DATA_COLLECTIONS": [],
            "TEMPERATURE": 0.7,
            "MODE": "BASIC"
        },
        "test-assistant-2": {
            "MODEL_ID": "gpt-4o",
            "ROLE_ID": "8643d3f1-37c3-4ed3-87f7-ffeffac40db7",
            "SELECTED_FILES": ["66df99f8-1abe-4c8a-96ee-56edef357536_debug_file.pdf"],
            "SELECTED_DATA_COLLECTIONS": [],
            "TEMPERATURE": 0.5,
            "MODE": "QA"
        },
        "assistant-LinzAG-Sport": {
            "MODEL_ID": "gpt-4o",
            "ROLE_ID": "1234abcd-5678-efgh-ijkl-9012mnop3456",
            "SELECTED_FILES": ["66df99f8-1abe-4c8a-96ee-56edef357536_LinzAG_sport.docx"],
            "SELECTED_DATA_COLLECTIONS": [],
            "TEMPERATURE": 0.7,
            "MODE": "BASIC"
        },
        "HelpcenterHelper_1": {
            "MODEL_ID": "gpt-4o",
            "ROLE_ID": "337f25d4-6bb0-4636-8997-f148b0db2980",  # "HelpcenterHelper_1" 
            "SELECTED_FILES": [],
            "SELECTED_DATA_COLLECTIONS": ["9538e4e4-f168-42a2-9f0e-3edcddccb96e"],
            "TEMPERATURE": 0.7,
            "MODE": "QA"
        },
         "HelpcenterHelper_2": {
            "MODEL_ID": "gpt-4o",
            "ROLE_ID": "f9eb7ec2-ef8a-4953-9ed9-7bc5243e93a9",  # "HelpcenterHelper_2" 
            "SELECTED_FILES": [],
            "SELECTED_DATA_COLLECTIONS": ["07590988-04df-4bf9-ba6a-a8b3ca1cc736"],
            "TEMPERATURE": 0.7,
            "MODE": "QA"
        },
          "DemoBot_1": {
            "MODEL_ID": "gpt-4o",
            "ROLE_ID": "e2084980-afe5-43de-9ec5-5febc568370e",  # "DemoBot_1" 
            "SELECTED_FILES": [],
            "SELECTED_DATA_COLLECTIONS": ["6106d18b-7e95-43e5-b4b7-58b6cb48a2da"],
            "TEMPERATURE": 0.7,
            "MODE": "QA"
        }




    }
    
    return ASSISTANT_SETTINGS

class ChatBotService:
    # Class-level configuration
    API_URL = os.getenv("API_URL")
    API_KEY = os.getenv("API_KEY")
    API_ORGANIZATION_ID = os.getenv("API_ORGANIZATION_ID")
    
    def __init__(self, public_cors_origins=None, private_cors_origins=None, template_path=None):
        # Load environment variables
        load_dotenv()
        
        # Store CORS origins
        self.public_cors_origins = public_cors_origins or []
        self.private_cors_origins = private_cors_origins or []
        
        # Load assistant settings
        load_assistant_settings()
        
        # Set template path
        if template_path:
            self.template_path = template_path
        else:
            # Default to a template in the same directory as this file
            current_dir = pathlib.Path(__file__).parent.absolute()
            self.template_path = os.path.join(current_dir, 'bot_template.js')
        
        # Check if template exists
        if not os.path.exists(self.template_path):
            print(f"Warning: Bot template not found at {self.template_path}")
            print("Creating default template file...")
            self._create_default_template()
        
        # Initialize AWS service with template path
        self.aws_service = AWSService(template_path=self.template_path)
        
        # Create the blueprint with all routes
        self.api = self._create_blueprint()
        
        print("ChatBot service initialized.")
        print(f"Using bot template: {self.template_path}")
    
    def _create_default_template(self):
        """Create a default template file if none exists"""
        try:
            # Create directory if it doesn't exist
            os.makedirs(os.path.dirname(self.template_path), exist_ok=True)
            
            # Minimal template content
            minimal_template = """/**
            * Chat Bot for Web Integration - Default Template
            * Version: 1.0.0
            */

            // Configuration - this will be replaced during updates
            const myCustomConfig = {
            "LOGO_URL": "https://placeholder.com/logo.png",
            "CHAT_TITLE": "Chat Bot",
            "CHAT_SUBTITLE": "Your virtual assistant",
            "PICKER_GREETING": {
                "LINE1": "Hello!",
                "LINE2": "How can I help you?",
                "DESCRIPTION": "I can answer questions about our services."
            },
            "COLORS": {
                "primary": "#0077cc",
                "botBg": "#f0f0f0",
                "botText": "#333333",
                "userBg": "#0077cc",
                "userText": "#ffffff"
            },
            "ERROR_MESSAGE": "Sorry, something went wrong.",
            "INPUT_PLACEHOLDER": "Type your question here...",
            "API_ENDPOINT": "https://example.com/chat",
            "ASSISTANTS": []
            };
            // End of configuration

            // Main chat bot code would go here
            (function() {
            console.log("Chat bot initialized with template config");
            })();
            """
            # Write to file
            with open(self.template_path, 'w', encoding='utf-8') as f:
                f.write(minimal_template)
            
            print(f"Created default template at {self.template_path}")
        except Exception as e:
            print(f"Error creating default template: {str(e)}")
    
    def _create_blueprint(self):
        # Create a new blueprint
        api_bp = Blueprint("api", __name__)
        
        # Define basic routes
        @api_bp.route('/')
        def hello_geek():
            return '<h1>Please enter a valid route!</h1>'
        
        @api_bp.route('/hello')
        def hello():
            print("Welcome to the chatbot service API")
            return "<h1>Welcome to the Chatpot Prototype service API</h1>"
        
        @api_bp.get("/status")
        def get_status():
            print("Service is running")
            return jsonify({"message": "Service is running"}), 200
        
        # Public chat endpoint
        @api_bp.route('/v1/public/chat', methods=['POST'])
        @cross_origin(origins=self.public_cors_origins)
        def public_chat():
            return self._handle_chat_request()
        
        # Private chat endpoint
        @api_bp.route('/v1/private/chat', methods=['POST'])
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
        
        # Publish bot endpoint - using AWS service
        @api_bp.route('/v1/private/publish-bot', methods=['POST'])
        @cross_origin(origins=self.private_cors_origins)
        def publish_bot():
            try:
                # Add a single debug message at the beginning
                print("Publish bot endpoint called")
                
                # Check if we're using the old file upload method or new config method
                if request.files and 'bot_js' in request.files:
                    # Old method - file upload
                    file = request.files.get('bot_js')
                    print("Using file upload method")
                    result, status_code = self.aws_service.publish_bot_from_file(file)
                else:
                    # New method - using config
                    try:
                        # Get the JSON data and handle both formats
                        data = request.get_json(force=True)
                        
                        # Print only once and limit output size
                        print(f"Request contains JSON data of size: {len(str(data))}")
                        
                        if not data:
                            return jsonify({"error": "No JSON data received"}), 400
                        
                        # Check if data is directly the config or has 'config' key
                        if isinstance(data, dict) and 'config' in data:
                            config = data['config']
                        else:
                            # If the data is directly the config (no wrapping)
                            config = data
                        
                        # Print only once
                        print(f"Config contains {len(config)} top-level keys")
                        
                        if not config:
                            return jsonify({"error": "Empty config received"}), 400
                        
                        result, status_code = self.aws_service.publish_bot(config)
                    except Exception as json_error:
                        print(f"JSON parsing error: {str(json_error)}")
                        return jsonify({"error": f"Invalid JSON data: {str(json_error)}"}), 400
                
                return jsonify(result), status_code
            except Exception as e:
                print(f"Error publishing bot: {str(e)}")
                return jsonify({"error": str(e)}), 500

        
        # Bot configuration update endpoint - using template
        @api_bp.route('/v1/private/update-bot-config', methods=['POST'])
        @cross_origin(origins=self.private_cors_origins)
        def update_bot_config():
            try:
                
                # Get data from request body
                data = request.json
                if not data or 'config' not in data:
                    return jsonify({"error": "Request must contain a 'config' object"}), 400
                
                # Get the new configuration
                new_config = data['config']
                
                # Get the optional key parameter (default to 'bot.js' if not provided)
                key = data.get('key', 'bot.js')
                
                # Call AWS service with parameters
                result, status_code = self.aws_service.update_bot_config(new_config, key)
                return jsonify(result), status_code
                
            except Exception as e:
                print(f"Error updating bot config: {str(e)}")
                return jsonify({"error": str(e)}), 500
          
        @api_bp.route('/v1/private/delete-bot', methods=['POST'])
        @cross_origin(origins=self.private_cors_origins)
        def delete_bot():
            try:
                # Get data from request body
                data = request.json
                if not data or 'key' not in data:
                    return jsonify({"error": "Request must contain a 'key' field"}), 400
                
                # Get the key parameter
                key = data['key']
                
                # Call AWS service to delete the bot
                result, status_code = self.aws_service.delete_bot(key)
                return jsonify(result), status_code
                    
            except Exception as e:
                print(f"Error deleting bot: {str(e)}")
                return jsonify({"error": str(e)}), 500
            
        # New endpoint to download current bot JS
        @api_bp.route('/v1/private/download-bot', methods=['GET'])
        @cross_origin(origins=self.private_cors_origins)
        def download_bot():
            try:
                # Get key parameter (default to 'bot.js' if not provided)
                key = request.args.get('key', 'bot.js')
                
                # Call AWS service to download the bot
                result, status_code = self.aws_service.download_current_bot(key)
                return jsonify(result), status_code
                
            except Exception as e:
                print(f"Error downloading bot: {str(e)}")
                return jsonify({"error": str(e)}), 500
        
        # New endpoint to get the template file
        @api_bp.route('/v1/private/get-template', methods=['GET'])
        @cross_origin(origins=self.private_cors_origins)
        def get_template():
            try:
                if not os.path.exists(self.template_path):
                    return jsonify({"error": f"Template file not found at {self.template_path}"}), 404
                
                with open(self.template_path, 'r', encoding='utf-8') as f:
                    template_content = f.read()
                
                return jsonify({
                    "message": "Template retrieved successfully",
                    "template": template_content,
                    "path": self.template_path,
                    "size": len(template_content)
                }), 200
                
            except Exception as e:
                print(f"Error retrieving template: {str(e)}")
                return jsonify({"error": str(e)}), 500
        
        # New endpoint to update the template file
        @api_bp.route('/v1/private/update-template', methods=['POST'])
        @cross_origin(origins=self.private_cors_origins)
        def update_template():
            try:
                # Get the new template content from request
                data = request.json
                if not data or 'template' not in data:
                    return jsonify({"error": "Request must contain a 'template' field"}), 400
                
                new_template = data['template']
                
                # Save the new template
                try:
                    with open(self.template_path, 'w', encoding='utf-8') as f:
                        f.write(new_template)
                    
                    return jsonify({
                        "message": "Template updated successfully",
                        "path": self.template_path,
                        "size": len(new_template)
                    }), 200
                    
                except Exception as write_error:
                    return jsonify({"error": f"Failed to write template: {str(write_error)}"}), 500
                
            except Exception as e:
                print(f"Error updating template: {str(e)}")
                return jsonify({"error": str(e)}), 500
            
        return api_bp
    
    def _handle_chat_request(self):
        """
        Common chat handling logic for both public and private endpoints
        """
        try:
            data = request.json
            if not data:
                return jsonify({"error": "Request body must contain JSON data"}), 400
            
            # Get assistant ID from request
            assistant_id = data.get("assistantId")
            
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
            
            if response.status_code == 200:
                # Process the streaming response to extract `data:` fields
                response_text = ""
                for line in response.iter_lines():
                    decoded_line = line.decode("utf-8")
                    if decoded_line.startswith("data:"):
                        response_text += decoded_line[5:].strip() + "\n"
                
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