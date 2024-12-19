#!/bin/bash

# build docker image and run docker container script
# only for local development purposes!

docker build -t 506data/ocr-service:internal -f docker/Dockerfile .
docker run -p 5000:5000 --env-file ./.env 506data/ocr-service:internal