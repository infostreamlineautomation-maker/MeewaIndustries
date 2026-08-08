#!/bin/bash
# VPS Deployment Script

echo "Pulling latest changes from repository..."
# git pull origin main

echo "Stopping existing containers..."
docker-compose down

echo "Rebuilding and starting containers in detached mode..."
docker-compose up --build -d

echo "Deployment complete! Verify services with 'docker ps'."
