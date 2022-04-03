#!/bin/bash

# Create the .env file and add a valid API key
read -p "Enter your deepgram API key: " DEEPGRAM_KEY

echo "Attempting to connect to deepgram..."
response=$(curl --write-out %{http_code} --silent --output /dev/null -X GET -H "Authorization: Token $DEEPGRAM_KEY" https://api.deepgram.com/v1/projects/)

if [[ $response == "200" ]]; then
  echo "Success. Creating .env file"
  cat .env.example >.env
  sed -i "s/DEEPGRAM_KEY=.*/DEEPGRAM_KEY=$DEEPGRAM_KEY/g" .env
else
  echo "Failed to connect to deepgram! $response"
  exit 1
fi