#!/bin/bash

# Create a zip file of the project for sharing
echo "Creating ZIP file of the Maritime Fuel Calculator project..."

# Define the output zip filename with date
ZIPFILE="maritime_fuel_calculator_$(date +%Y%m%d).zip"

# Create a list of directories and files to include
INCLUDE=(
  "client"
  "server" 
  "shared"
  "public"
  "README.md"
  "package.json"
  "package-lock.json"
  "vite.config.ts"
  "postcss.config.js"
  "tailwind.config.ts"
  "tsconfig.json"
  "index.html"
  ".env.example"
)

# Create a list of directories and files to exclude
EXCLUDE=(
  "node_modules"
  ".git"
  "dist"
  ".replit"
  ".config"
  "attached_assets"
  ".gitignore"
  ".env"
)

# Create exclude arguments for zip command
EXCLUDE_ARGS=""
for item in "${EXCLUDE[@]}"; do
  EXCLUDE_ARGS="$EXCLUDE_ARGS --exclude=*$item*"
done

# Create the zip file with included files and excluding specified items
zip -r $ZIPFILE "${INCLUDE[@]}" $EXCLUDE_ARGS

echo "ZIP file created successfully: $ZIPFILE"
echo "You can now share this ZIP file with others."