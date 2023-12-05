#!/bin/bash

# Login and get token
login_response=$(curl -s -X POST http://localhost:3000/api/auth/login -H "Content-Type: application/json" -d '{"username": "yourUsername", "password": "yourPassword"}')
token=$(echo $login_response | jq -r '.token')

# Check if we got a token
if [ -z "$token" ] || [ "$token" = "null" ]; then
  echo "Login failed or token not received"
  exit 1
fi

echo "Received token: $token"

# Use the token in the next request and capture the response with verbosity enabled
recipe_response=$(curl -v -s -X POST http://localhost:3000/api/recipes/generate-recipe -H "Content-Type: application/json" -H "Authorization: Bearer $token" -d '{"ingredients": ["chicken", "rice", "garlic", "tomatoes"]}')

# Echo the recipe response
echo "Recipe response: $recipe_response"
