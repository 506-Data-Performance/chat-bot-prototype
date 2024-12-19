FROM python:3.8-slim

RUN apt-get update

WORKDIR /ocr-service

COPY . .
COPY requirements.txt requirements.txt
RUN pip install -r requirements.txt
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    tesseract-ocr \
    tesseract-ocr-deu \
    tesseract-ocr-eng \
    tesseract-ocr-ita \  
    tesseract-ocr-fra \  
    libtesseract-dev\
    ghostscript \
    curl \
    poppler-utils && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*
# curl needed for container health check

# Start the app with Gunicorn
CMD gunicorn -w 4 -b 0.0.0.0:8000 -t 600 "app:create_app()"