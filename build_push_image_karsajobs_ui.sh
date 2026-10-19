#!/bin/bash

# Build Docker image untuk frontend Karsa Jobs
docker build -t radityabp/karsajobs-ui:latest .

# Login ke Docker Hub
docker login -u radityabp

# Push image frontend ke Docker Hub
docker push radityabp/karsajobs-ui:latest
