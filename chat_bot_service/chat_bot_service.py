import flask
import os
from flask import Blueprint, jsonify, request
import requests
from dotenv import load_dotenv

load_dotenv()  # Load environment variables as early as possible

# Define the Blueprint
api: flask.Blueprint = Blueprint("api", __name__)

@api.route('/')
def hello_geek():
    return '<h1>Please enter a valid route!</h1>'

@api.route('/hello')
def hello():
    print("Welcome to the ocr service API")
    return "<h1>Welcome to the Chatpot Prototype service API</h1>"

@api.get("/status")
def get_status():
    print("Service is running")
    return jsonify({"message": "Service is running"}), 200


class ChatBotService:
    # Class-level configuration
    API_URL = os.getenv("API_URL", "https://506.506.ai:3003/api/v1/public/chat?internalSystemPrompt=true")
    API_KEY = os.getenv("API_KEY")
    API_ORGANIZATION_ID = os.getenv("API_ORGANIZATION_ID")
    print(API_URL, API_KEY, API_ORGANIZATION_ID)

    def __init__(self):
        load_dotenv()
        print("OCR service initialized.")
        self.api = api


@api.post("/v1/chat")
def chat():
    """
    Chat endpoint that forwards the request to the 506.ai API.
    """
    try:
        data = request.json
        if not data:
            return jsonify({"error": "Request body must contain JSON data"}), 400

        print("Received data:", data)

        payload = {
            "model": {"id": data.get("model_id", "gpt-4o-mini")},
            "messages": data.get("messages", []),
            "roleId": "",
            "temperature": data.get("temperature", 0.7),
            "selectedMode": data.get("selectedMode", "BASIC"),
            "selectedFiles": data.get("selectedFiles", ["66df99f8-1abe-4c8a-96ee-56edef357536_Mittarbeiter_new.pdf"]),
            "selectedDataCollections": data.get("selectedDataCollections", [])
        }

        #print("API key:", ChatBotService.API_KEY)
        #print("API organization ID:", ChatBotService.API_ORGANIZATION_ID)
        #print("API URL:", ChatBotService.API_URL)

        headers = {
            "Content-Type": "application/json",
            "api-key": ChatBotService.API_KEY,
            "api-organization-id": ChatBotService.API_ORGANIZATION_ID
        }

        # Send the POST request to the API
        response = requests.post(ChatBotService.API_URL, json=payload, headers=headers, stream=True)
        print("Response status code:", response.status_code)
        #print("Response headers:", response.headers)

        if response.status_code == 200:
            # Process the streaming response to extract `data:` fields
            response_text = ""
            for line in response.iter_lines(decode_unicode=True):
                if line.startswith("data:"):
                    # Extract the text after "data:" and add it to the response text
                    response_text += line[5:].strip() + "\n"

            print("Extracted Response:", response_text)
            return jsonify({"response": response_text.strip()}), 200
        else:
            try:
                error_details = response.json()
            except ValueError:
                error_details = {"error": "Non-JSON response", "details": response.text}
            return jsonify({"error": "API call failed", "details": error_details}), response.status_code
    except Exception as e:
        return jsonify({"error": str(e)}), 500