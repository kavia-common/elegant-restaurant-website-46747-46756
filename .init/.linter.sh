#!/bin/bash
cd /home/kavia/workspace/code-generation/elegant-restaurant-website-46747-46756/restaurant_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

