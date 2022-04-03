#/bin/bash

# Bring the app down, fetch from github, then restart
docker-compose --file docker-compose.p.yaml down
git pull origin main
docker-compose --file docker-compose.p.yaml up -d --build