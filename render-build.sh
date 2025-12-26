#!/usr/bin/env bash
# exit on error
set -o errexit

npm install
cd frontend
npm install
npm run build
cd ../backend
npm install
npm run build
