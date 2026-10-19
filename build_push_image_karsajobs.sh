
#!/bin/bash

set -e

# Build Docker image untuk backend Karsa Jobs
docker build -t radityabp/karsajobs:latest .

# Login ke Docker Hub
docker login -u radityabp

# Push image backend ke Docker Hub
docker push radityabp/karsajobs:latest

