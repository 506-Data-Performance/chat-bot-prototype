import flask
import os
from flask import Blueprint, jsonify, request, send_file
from dotenv import load_dotenv
import ocrmypdf
import tempfile
import shutil

# Define the Blueprint at the module level
api: flask.Blueprint = Blueprint("api", __name__)

@api.route('/')
def hello_geek():
    # This endpoint serves as a default route that informs the user to enter a valid route.
    return '<h1>Please enter a valid route!</h1>'

@api.route('/hello')
def hello():
    # This endpoint returns a simple welcome message for the OCR service API.
    print("Welcome to the ocr service API")
    return "<h1>Welcome to the OCR service API</h1>"

@api.get("/status")
def get_status():
    # This endpoint returns the status of the service, indicating that it is running.
    print("Service is running")
    return jsonify({"message": "Service is running"}), 200

class OcrService:
    def __init__(self):
        # Initializes the OCR service by loading environment variables.
        load_dotenv()
        print("OCR service initialized.")
        # Registers the API blueprint within this class.
        self.api = api

    @staticmethod
    @api.post('/v1/createSearchablePdf')
    def create_searchable_pdf():
        # This endpoint handles the creation of a searchable PDF from an uploaded file.

        # Check if a file is included in the request.
        if 'file' not in request.files:
            return jsonify({"error": "No file part"}), 400

        # Retrieve the uploaded file.
        file = request.files['file']
        # Check if a file is selected.
        if file.filename == '':
            return jsonify({"error": "No selected file"}), 400

        # Extract the original filename (without the extension) for output naming.
        original_filename = os.path.splitext(file.filename)[0]
        output_filename = f"{original_filename}.pdf"

        # Use a temporary directory for processing files to ensure clean-up after processing.
        with tempfile.TemporaryDirectory() as temp_dir:
            input_pdf_path = os.path.join(temp_dir, 'input_uploaded.pdf')
            output_pdf_path = os.path.join(temp_dir, output_filename)

            # Save the uploaded file to the temporary directory.
            file.save(input_pdf_path)

            try:
                # Use OCRmyPDF to convert the input PDF to a searchable PDF.
                # The 'deskew' option corrects skewed text, and 'language' specifies OCR languages.
                ocrmypdf.ocr(
                    input_pdf_path,
                    output_pdf_path,
                    output_type='pdf',
                    deskew=True,
                    rotate_pages=True,  # Automatically detect and correct rotated pages
                    language='deu+eng+ita+fra',  # Specifies German, English, Italian, and French for OCR processing.
                    force_ocr=True  
                )

                # Copy the output file to a location outside the temporary directory for serving.
                final_output_path = os.path.join(tempfile.gettempdir(), output_filename)
                shutil.copy(output_pdf_path, final_output_path)

                # Return the generated searchable PDF as a downloadable response.
                return send_file(
                    final_output_path,
                    as_attachment=True,
                    download_name=output_filename
                )
            except Exception as e:
                # Handles any exceptions that occur during the OCR process.
                return jsonify({"error": str(e)}), 500