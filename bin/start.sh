#!/bin/bash

# Start the app in dev or prod mode
while getopts dp flag; do
  case "${flag}" in
  d)
    echo "Starting Chattergram in dev mode"
    docker-compose --file docker-compose.d.yaml up --build
    ;;
  p)
    echo "Starting Chattergram in production mode"
    docker-compose --file docker-compose.p.yaml up -d --build
    ;;
  *)
    echo "Usage: $0 [-d] [-p]" >&2
    exit 1
    ;;
  esac
done
