#!/bin/bash

# Check if a filename argument is provided
if [ -z "$1" ]; then
  echo "Usage: $0 <filename>"
  exit 1
fi

# Create the file with the provided filename in the specified directory
touch "./database/migrations/$(date +%Y%m%dT%H%M%S)_$1.ts"

echo "File created: ./database/migrations/$(date +%Y%m%dT%H%M%S)_$1.ts"
