import os
import requests
import urllib.parse
from dotenv import load_dotenv

class Config:
    def __init__(self):
        load_dotenv()
        self.config_data = self.load_config_from_url()

    def load_config_from_url(self):
        base_url = os.getenv("SECRETS_SERVICE_PATH")
        customer = os.getenv("CUSTOMER")
        api_key = os.getenv("SECRETS_SERVICE_API_KEY")
        print(f"Loading config from {base_url} for customer {customer}")

        # Encode the customer parameter for use in the URL
        encoded_customer = urllib.parse.quote(customer)

        # Append the endpoint and construct the full URL with the customer query parameter
        endpoint = "/api/secretsVS"
        full_url = f"{base_url}{endpoint}?customer={encoded_customer}"

        # Prepare the headers with the API key
        headers = {
            "secrets-service-api-key": api_key
        }

        try:
            # for testing add verify=False
            response = requests.get(full_url, headers=headers,)  
            response.raise_for_status()  # Raise an error for bad status codes
            config_data = response.json()  # Parse the JSON response
            #print(f"Configuration loaded: {config_data}")
            return config_data
           
        except requests.exceptions.RequestException as e:
            error_message = f"Error fetching configuration from {full_url}: {e}"
            print(error_message)
            return error_message
             
config = Config()
